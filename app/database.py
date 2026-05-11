"""
app/database.py
───────────────
Async SQLAlchemy engine, session factory, and dependency.
Uses asyncpg as the driver for PostgreSQL.
"""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import text

from app.config import settings


# ── Database URL Conversion ───────────────────────────────────────────────────
# WHY: Neon and many hosting providers provide DATABASE_URL in this format:
#      postgresql://user:password@host/dbname
#
# But SQLAlchemy's async engine with asyncpg requires:
#      postgresql+asyncpg://user:password@host/dbname
#
# This converts the URL automatically so you can keep a standard DATABASE_URL
# in your .env file and deployment settings.
DATABASE_URL = settings.DATABASE_URL

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+asyncpg://",
        1,
    )


# ── Engine ────────────────────────────────────────────────────────────────────
# WHY: We use create_async_engine because FastAPI is asynchronous.
# A synchronous database driver would block the server while waiting for
# database responses, which is a splendid way to make everything slower.
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG,      # Logs SQL statements in development.
    pool_size=10,             # Keeps 10 persistent connections ready.
    max_overflow=20,          # Allows 20 extra temporary connections.
    pool_pre_ping=True,       # Checks connections before using them.
)


# ── Session Factory ───────────────────────────────────────────────────────────
# WHY: Creates AsyncSession objects used to communicate with the database.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,   # Keeps loaded objects usable after commit.
    autoflush=False,
    autocommit=False,
)


# ── Dependency ────────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides one database session per request.
    Automatically commits on success and rolls back on failure.
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


# ── Health Check Helper ───────────────────────────────────────────────────────
async def check_db_connection() -> bool:
    """
    Returns True if the database is reachable.
    """
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False