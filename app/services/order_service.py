import uuid
from decimal import Decimal
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate


class OrderService:
    TAX_RATE = Decimal("0.00")  # Removed tax to match frontend
    SHIPPING_FLAT_RATE = Decimal("5.99") # Updated to match frontend $5.99

    @staticmethod
    async def calculate_total(db: AsyncSession, items: List) -> Decimal:
        """
        Calculate the total amount for a set of items without creating an order.
        Amount includes subtotal, tax, and shipping.
        """
        product_ids = [item.product_id for item in items]
        query = select(Product).where(Product.id.in_(product_ids))
        result = await db.execute(query)
        products = {p.id: p for p in result.scalars().all()}

        subtotal = Decimal("0.00")
        for item_data in items:
            product = products.get(item_data.product_id)
            if not product:
                continue
            unit_price = Decimal(str(product.price))
            subtotal += unit_price * item_data.quantity

        tax_amount = subtotal * OrderService.TAX_RATE
        shipping_amount = Decimal("0.00")
        if subtotal > 0 and subtotal <= 35:
            shipping_amount = OrderService.SHIPPING_FLAT_RATE
        return subtotal + tax_amount + shipping_amount

    @staticmethod
    async def create_order(
        db: AsyncSession,
        user_id: uuid.UUID,
        order_data: OrderCreate,
        payment_status: PaymentStatus = PaymentStatus.unpaid
    ) -> Order:
        # 1. Fetch products to get current prices and validate stock
        product_ids = [item.product_id for item in order_data.items]
        query = select(Product).where(Product.id.in_(product_ids))
        result = await db.execute(query)
        products = {p.id: p for p in result.scalars().all()}

        if len(products) != len(set(product_ids)):
            missing = set(product_ids) - set(products.keys())
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Products not found: {missing}"
            )

        # 2. Calculate prices and update inventory
        subtotal = Decimal("0.00")
        order_items = []

        for item_data in order_data.items:
            product = products[item_data.product_id]
            
            if product.stock_quantity < item_data.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Not enough stock for {product.name}"
                )

            unit_price = Decimal(str(product.price))
            item_subtotal = unit_price * item_data.quantity
            subtotal += item_subtotal

            product.stock_quantity -= item_data.quantity

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    product_name=product.name,
                    quantity=item_data.quantity,
                    unit_price=unit_price,
                    subtotal=item_subtotal
                )
            )

        # 3. Calculate final totals
        tax_amount = subtotal * OrderService.TAX_RATE
        shipping_amount = Decimal("0.00")
        if subtotal > 0 and subtotal <= 35:
            shipping_amount = OrderService.SHIPPING_FLAT_RATE
        total_amount = subtotal + tax_amount + shipping_amount

        # 4. Save the Order
        new_order = Order(
            user_id=user_id,
            status=OrderStatus.confirmed if payment_status == PaymentStatus.paid else OrderStatus.pending,
            payment_status=payment_status,
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address,
            notes=order_data.notes,
            items=order_items
        )

        # 5. Award Baker Points (10 points per dollar)
        query_user = select(User).where(User.id == user_id)
        res_user = await db.execute(query_user)
        user = res_user.scalar_one()
        user.points += int(total_amount * 10)

        db.add(new_order)
        await db.commit()
        await db.refresh(new_order)
        
        return new_order

    @staticmethod
    async def get_user_orders(db: AsyncSession, user_id: uuid.UUID) -> List[Order]:
        query = select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_all_orders(db: AsyncSession) -> List[Order]:
        query = select(Order).order_by(Order.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_order_by_id(db: AsyncSession, order_id: uuid.UUID, user_id: uuid.UUID) -> Order:
        query = select(Order).where(Order.id == order_id, Order.user_id == user_id)
        result = await db.execute(query)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order

    @staticmethod
    async def update_order_status(db: AsyncSession, order_id: uuid.UUID, new_status: str) -> Order:
        query = select(Order).where(Order.id == order_id)
        result = await db.execute(query)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.status = new_status
        await db.commit()
        await db.refresh(order)
        return order
