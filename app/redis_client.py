"""
app/redis_client.py
────────────────────
Async Redis client singleton using redis-py.
Provides a connection pool and a FastAPI dependency.
"""
from typing import AsyncGenerator

import redis.asyncio as aioredis
from redis.asyncio import Redis

from app.config import settings

# ── Global pool ───────────────────────────────────────────────────────────────
# WHY: We use a global singleton pool to avoid the overhead of re-connecting 
# to Redis on every single request. A single pool handles multiple concurrent requests.
_redis_pool: Redis | None = None


async def init_redis() -> None:
    """
    Initialize the Redis connection pool.
    
    WHY: We initialize this on startup (lifespan) so that the app fails early 
    if Redis is missing, rather than crashing on the first user request.
    """
    global _redis_pool
    _redis_pool = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        # WHY: decode_responses=True automatically converts Redis bytes to Python strings, 
        # saving us from having to call .decode() manually everywhere.
        decode_responses=True,
        max_connections=20,
    )
    # Verify connection
    await _redis_pool.ping()


async def close_redis() -> None:
    """
    Close the Redis connection pool. 
    
    WHY: Gracefully closing the pool on shutdown ensures that Redis server resources 
    are freed and no 'zombie' connections are left hanging.
    """
    global _redis_pool
    if _redis_pool:
        await _redis_pool.aclose()
        _redis_pool = None


def get_redis_client() -> Redis:
    """Returns the global Redis client singleton."""
    if _redis_pool is None:
        raise RuntimeError("Redis pool not initialized. Call init_redis() first.")
    return _redis_pool


# ── FastAPI Dependency ────────────────────────────────────────────────────────
async def get_redis() -> AsyncGenerator[Redis, None]:
    """
    FastAPI dependency that yields the Redis client.

    WHY: Injecting Redis via Depends() makes our code testable. In unit tests, 
    we can easily swap the real Redis client for a mock (fake) client.
    """
    client = get_redis_client()
    yield client


# ── Health check helper ───────────────────────────────────────────────────────
async def check_redis_connection() -> bool:
    """Returns True if Redis is reachable."""
    try:
        client = get_redis_client()
        return await client.ping()
    except Exception:
        return False
