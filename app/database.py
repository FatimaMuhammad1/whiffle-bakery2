"""
app/database.py
───────────────
Async SQLAlchemy engine, session factory, and FastAPI dependency.
Supabase-ready (asyncpg + SSL support).
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import text

from app.config import settings


# ─────────────────────────────────────────────────────────────
# DATABASE URL FIX
# ─────────────────────────────────────────────────────────────
# Convert standard Postgres URL → asyncpg URL
DATABASE_URL = settings.DATABASE_URL

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+asyncpg://",
        1,
    )


# ─────────────────────────────────────────────────────────────
# ENGINE
# ─────────────────────────────────────────────────────────────
# Supabase REQUIREMENT: SSL must be enabled or connections fail randomly.
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG,

    # Connection pool (keep small for Supabase free tier)
    pool_size=3,
    max_overflow=5,

    # Prevent stale connections (important for cloud DBs)
    pool_pre_ping=True,

    # Supabase SSL fix
    connect_args={
        "ssl": "require"
    },
)


# ─────────────────────────────────────────────────────────────
# SESSION FACTORY
# ─────────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ─────────────────────────────────────────────────────────────
# FASTAPI DEPENDENCY
# ─────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a database session per request.
    Auto-commits on success, rolls back on error.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ─────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────
async def check_db_connection() -> bool:
    """
    Simple DB connectivity test.
    """
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False