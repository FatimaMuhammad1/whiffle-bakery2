import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select
import sys

async def test_delete(email):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            print(f"User {email} not found")
            return
        
        print(f"Attempting to delete user {user.username} ({user.id})")
        try:
            await db.delete(user)
            await db.commit()
            print("Successfully deleted user")
        except Exception as e:
            print(f"FAILED to delete user: {e}")
            await db.rollback()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "i.fatima.is.here@gmail.com"
    asyncio.run(test_delete(email))
