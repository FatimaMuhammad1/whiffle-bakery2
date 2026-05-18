from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService
from app.services.email_service import EmailService
from app.services.payment_service import PaymentService
from app.schemas.payment import PaymentIntentRequest, PaymentIntentResponse
from app.utils.captcha import verify_captcha
from app.dependencies.admin import admin_required

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payload: PaymentIntentRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a Stripe client secret for the frontend.
    Amount must be provided in cents.
    """
    try:
        from app.config import settings
        if not settings.STRIPE_SECRET_KEY:
            raise ValueError("STRIPE_SECRET_KEY is not configured on the server. Please set it in your environment variables.")

        intent = await PaymentService.create_payment_intent(payload.amount)
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def checkout(
    order_data: OrderCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Checkout API endpoint.
    Verifies CAPTCHA and creates an order.
    """
    # 1. Verify CAPTCHA
    if not await verify_captcha(order_data.captcha_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CAPTCHA verification failed. Please try again."
        )

    # 2. Pre-calculate total for payment verification
    # WHY: We must verify that the amount paid matches the products in the cart 
    # to prevent price-tampering attacks.
    total_amount = await OrderService.calculate_total(db, order_data.items)
    # Stripe expects amounts in cents
    expected_cents = int(total_amount * 100)
    print(f"DEBUG: Checkout total_amount: {total_amount}, expected_cents: {expected_cents}")

    # 3. Verify Stripe Payment
    if not await PaymentService.verify_payment_intent(order_data.payment_intent_id, expected_cents):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed. Please ensure the payment was successful."
        )

    # 4. Create Order
    from app.models.order import PaymentStatus
    order = await OrderService.create_order(
        db, 
        current_user.id, 
        order_data, 
        payment_status=PaymentStatus.paid
    )

    # 3. Send Confirmation Email in background
    background_tasks.add_task(
        EmailService.send_order_confirmation,
        current_user.email,
        str(order.id),
        float(order.total_amount)
    )

    return order


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List current user's orders (or all orders if admin).
    """
    if current_user.role == "admin":
        return await OrderService.get_all_orders(db)
    return await OrderService.get_user_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific order by ID.
    """
    return await OrderService.get_order_by_id(db, order_id, current_user.id)


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    status_update: dict,
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """
    Update order status (Admin only).
    """
    from app.models.order import OrderStatus
    new_status = status_update.get("status")
    if new_status not in [s.value for s in OrderStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    return await OrderService.update_order_status(db, order_id, new_status)
    

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: UUID,
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """
    Delete an order (Admin only).
    """
    from app.models.order import Order
    from sqlalchemy import delete
    
    # We delete it directly for administrative cleanup
    result = await db.execute(delete(Order).where(Order.id == order_id))
    await db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return None
