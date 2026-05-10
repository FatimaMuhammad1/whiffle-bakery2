import asyncio
from app.database import engine
from app.models import Base

async def create_tables():
    print("Creating missing tables...")
    async with engine.begin() as conn:
        # This will create any table that doesn't exist
        await conn.run_sync(Base.metadata.create_all)
    print("Done!")

if __name__ == "__main__":
    asyncio.run(create_tables())
