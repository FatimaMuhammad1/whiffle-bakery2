"""
app/config.py
─────────────
Central configuration using Pydantic BaseSettings.
All values are read from environment variables or a .env file.
"""
import json
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "Bakery API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # CORS origins — stored as a raw comma-separated string so pydantic-settings
    # does NOT attempt to JSON-parse it (which would fail on plain CSV values).
    # Use the `cors_origins` property to get the final List[str].
    ALLOWED_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,http://localhost:8080,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:8080"
    )

    @property
    def cors_origins(self) -> List[str]:
        """Return ALLOWED_ORIGINS as a list, supporting both CSV and JSON-array formats."""
        v = self.ALLOWED_ORIGINS.strip()
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                pass
        return [o.strip().strip('"').strip("'") for o in v.split(",") if o.strip()]

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://bakery_user:bakery_pass@localhost:5432/bakery_db"
    )

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT ───────────────────────────────────────────────────────────────────
    JWT_SECRET: str = "change_me_to_a_very_long_random_secret_string"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_EXPIRE_DAYS: int = 7

    # ── Cookie ────────────────────────────────────────────────────────────────
    COOKIE_SECURE: bool = False       # True in production (HTTPS)
    COOKIE_SAMESITE: str = "lax"      # lax | strict | none

    # ── Google reCAPTCHA v3 ───────────────────────────────────────────────────
    RECAPTCHA_SITE_KEY: str = ""
    RECAPTCHA_SECRET_KEY: str = ""
    RECAPTCHA_SCORE_THRESHOLD: float = 0.5

    # ── Email ─────────────────────────────────────────────────────────────────
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@bakery.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # ── OTP ───────────────────────────────────────────────────────────────────
    OTP_EXPIRE_MINUTES: int = 10
    OTP_LENGTH: int = 6

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    
    WHY: We use @lru_cache to ensure the .env file is only read ONCE. 
    This improves performance because reading from the disk on every request 
    would be slow and unnecessary.
    """
    return Settings()


# WHY: Exposing the settings object here allows us to use it in other modules 
# without having to use FastAPI's Depends() if we are outside of a route.
settings = get_settings()
