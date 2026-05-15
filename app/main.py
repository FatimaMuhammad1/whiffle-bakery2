"""
app/main.py
────────────
FastAPI application entry point.

Responsibilities:
- Create the FastAPI app instance
- Configure CORS middleware
- Register all routers (added Day 2+)
- Lifespan handler: connect/disconnect DB and Redis on startup/shutdown
- Expose /health endpoint
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
    """
    Runs on startup (before yield) and shutdown (after yield).
    
    WHY: Using a lifespan handler is the modern way to manage resources in FastAPI. 
    It ensures that connections to Redis and DB are opened once when the app starts 
    and closed gracefully when it stops, preventing resource leaks.
    """
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")

    # Initialize Redis
    try:
        await init_redis()
        print("Redis connected")
    except Exception as e:
        # WHY: We catch the error so the server can still start even if Redis is down, 
        # though some features (OTP, caching) will be degraded.
        print(f"Redis connection failed: {e}")

    # Verify PostgreSQL
    db_ok = await check_db_connection()
    if db_ok:
        print("PostgreSQL connected")
    else:
        # WHY: We warn the developer immediately if the database is unreachable 
        # to avoid confusing 500 errors later.
        print("PostgreSQL connection failed — check DATABASE_URL")

    yield  # ← application runs here

    # Shutdown
    # WHY: Closing Redis connection pool on shutdown prevents 'hanging' processes 
    # and ensures all buffered data is handled.
    await close_redis()
    print("Shutdown complete")


# ── App Instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-style bakery backend: auth, products, orders, wishlist & more.",
    # WHY: We hide the Swagger UI in production for security (preventing API footprint discovery).
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)


# ── CORS ──────────────────────────────────────────────────────────────────────
# WHY: CORSMiddleware should be added as the LAST middleware (so it's the FIRST 
# to run on the request) to handle preflight OPTIONS requests correctly.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# app.add_middleware(GZipMiddleware, minimum_size=1000)  # Temporarily disabled to debug 400s


# ── Routers ───────────────────────────────────────────────────────────────────
from app.routers import products, categories, auth, orders, reminders, contact, wishlists, reviews, newsletter, recipes

# We'll use /api/v1 as our base prefix
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


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check() -> dict:
    """
    Returns the operational status of the application and its dependencies.
    Used by load balancers and monitoring tools.
    """
    db_ok = await check_db_connection()
    redis_ok = await check_redis_connection()

    status = "ok" if (db_ok and redis_ok) else "degraded"

    return {
        "status": status,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "services": {
            "database": "ok" if db_ok else "unreachable",
            "redis": "ok" if redis_ok else "unreachable",
        },
    }


# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root() -> dict:
    return {"message": f"Welcome to {settings.APP_NAME}", "docs": "/docs"}
