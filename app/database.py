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

# ── Engine ────────────────────────────────────────────────────────────────────
# WHY: We use create_async_engine because FastAPI is an async framework. 
# Using a synchronous driver (like psycopg2) would block the entire server 
# while waiting for the database to respond.
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,          # WHY: Logs SQL in development to help debug slow or incorrect queries.
    pool_size=10,                 # WHY: Keeps a 'pool' of 10 ready-to-use connections to avoid the cost of connecting every time.
    max_overflow=20,              # WHY: Allows temporarily creating 20 more connections if traffic spikes.
    pool_pre_ping=True,           # WHY: Checks if a connection is still alive before using it (prevents 'server closed' errors).
)

# ── Session Factory ───────────────────────────────────────────────────────────
# WHY: This is the factory that creates 'Session' objects. 
# A session is basically a "transaction" or a conversation with the database.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,       # WHY: Prevents SQLAlchemy from wiping local data after a commit, saving extra DB calls.
    autoflush=False,
    autocommit=False,
)


# ── Dependency ────────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides a database session per request.
    
    WHY: This pattern (Unit of Work) ensures that every API request gets its own 
    isolated transaction and that the connection is ALWAYS returned to the pool 
    even if the code crashes.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # WHY: We automatically commit if the request finishes successfully.
            await session.commit()
        except Exception:
            # WHY: We rollback if ANY error occurs during the request to keep data consistent.
            await session.rollback()
            raise
        finally:
            # WHY: Explicitly closing the session ensures we don't leak database connections.
            await session.close()


# ── Health check helper ───────────────────────────────────────────────────────
async def check_db_connection() -> bool:
    """Returns True if the database is reachable."""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
