import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
from app.config import settings
from app.models.user import User, UserRole
from app.utils.security import get_password_hash

engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def check_or_create_admin():
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.role == UserRole.admin))
        admin = result.scalar_one_or_none()
        
        if admin:
            print(f"Admin already exists: {admin.email}")
            # Update password to 'admin123' for simplicity
            admin.hashed_password = get_password_hash("admin123")
            admin.is_verified = True
            await db.commit()
            print("Reset password to 'admin123'")
        else:
            print("No admin found. Creating one...")
            admin = User(
                email="admin@whiffle.com",
                username="whiffle_admin",
                hashed_password=get_password_hash("admin123"),
                full_name="Whiffle Admin",
                role=UserRole.admin,
                is_verified=True,
                is_active=True
            )
            db.add(admin)
            await db.commit()
            print("Admin created: admin@whiffle.com / admin123")

if __name__ == "__main__":
    asyncio.run(check_or_create_admin())
