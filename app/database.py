"""
app/database.py
───────────────
Async SQLAlchemy setup for Supabase (POOLER compatible).
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import text

from app.config import settings


# ─────────────────────────────────────────────
# DATABASE URL
# ─────────────────────────────────────────────
DATABASE_URL = settings.DATABASE_URL

# Ensure asyncpg driver
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+asyncpg://",
        1,
    )


# ─────────────────────────────────────────────
# ENGINE (Supabase-safe config)
# ─────────────────────────────────────────────
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG,

    # IMPORTANT: Supabase free tier friendly pool
    pool_size=3,
    max_overflow=5,
    pool_pre_ping=True,

    # REQUIRED for Supabase
    connect_args={
        "ssl": "require"
    },
)


# ─────────────────────────────────────────────
# SESSION FACTORY
# ─────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ─────────────────────────────────────────────
# FASTAPI DEPENDENCY
# ─────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
async def check_db_connection() -> bool:
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False