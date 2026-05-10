from fastapi import Request, HTTPException, status
from app.redis_client import get_redis_client
import time

async def rate_limit(request: Request, limit: int = 5, window: int = 60):
    """
    Simple Redis-based rate limiter.
    limit: Max requests allowed
    window: Time window in seconds
    """
    try:
        client = get_redis_client()
        if not client:
            return

        # Use client IP as the key
        key = f"rate_limit:{request.client.host}:{request.url.path}"
        
        current = await client.get(key)
        if current and int(current) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        # Increment or initialize the counter
        p = client.pipeline()
        await p.incr(key)
        await p.expire(key, window)
        await p.execute()
    except (ConnectionError, Exception) as e:
        # WHY: In development or if Redis goes down, we don't want to block 
        # legitimate users from logging in. We just skip rate limiting.
        print(f"Rate limiter skipped: Redis unreachable ({e})")
        return
