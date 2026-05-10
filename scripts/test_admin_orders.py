import asyncio
from app.database import AsyncSessionLocal
from app.services.order_service import OrderService

async def test():
    async with AsyncSessionLocal() as db:
        orders = await OrderService.get_all_orders(db)
        print(f"Admin sees {len(orders)} orders")

if __name__ == "__main__":
    asyncio.run(test())
