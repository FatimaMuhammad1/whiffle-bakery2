import asyncio
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.begin() as conn:
        res = await conn.execute(text('SELECT id, user_id, total_amount, status FROM orders'))
        orders = res.fetchall()
        print(f"Total orders found: {len(orders)}")
        for o in orders:
            print(f"Order {o.id}: User {o.user_id}, Amount {o.total_amount}, Status {o.status}")
        
        res = await conn.execute(text('SELECT id, email, username, role FROM users'))
        users = res.fetchall()
        print(f"\nTotal users found: {len(users)}")
        for u in users:
            print(f"User {u.id}: Email {u.email}, Username {u.username}, Role {u.role}")

if __name__ == "__main__":
    asyncio.run(check())
