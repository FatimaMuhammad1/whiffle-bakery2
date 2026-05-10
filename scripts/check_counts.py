import asyncio
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.begin() as conn:
        res = await conn.execute(text('SELECT count(*) FROM orders'))
        print(f"Total orders: {res.scalar()}")
        
        res = await conn.execute(text('SELECT count(*) FROM users'))
        print(f"Total users: {res.scalar()}")

if __name__ == "__main__":
    asyncio.run(check())
