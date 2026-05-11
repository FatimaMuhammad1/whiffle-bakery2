"""
app/main.py
────────────
FastAPI entry point (clean + production-safe)
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import settings
from app.database import check_db_connection
from app.redis_client import check_redis_connection, init_redis, close_redis


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")

    # Redis init
    try:
        await init_redis()
        print("Redis connected")
    except Exception as e:
        print(f"Redis connection failed: {e}")

    # DB check
    try:
        db_ok = await check_db_connection()
        print("PostgreSQL connected" if db_ok else "PostgreSQL connection failed")
    except Exception as e:
        print(f"DB error: {e}")

    yield

    await close_redis()
    print("Shutdown complete")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-style bakery backend",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)


# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers ───────────────────────────────────────────────────────────────────
from app.routers import (
    products, categories, auth, orders, reminders,
    contact, wishlists, reviews, newsletter, recipes
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(reminders.router, prefix="/api/v1")
app.include_router(contact.router, prefix="/api/v1")
app.include_router(wishlists.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(recipes.router, prefix="/api/v1")


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    db_ok = await check_db_connection()
    redis_ok = await check_redis_connection()

    return {
        "status": "ok" if (db_ok and redis_ok) else "degraded",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "services": {
            "database": "ok" if db_ok else "unreachable",
            "redis": "ok" if redis_ok else "unreachable",
        },
    }


@app.get("/", tags=["System"])
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}", "docs": "/docs"}