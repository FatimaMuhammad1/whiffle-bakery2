import httpx
from fastapi import HTTPException, status
from app.config import settings

RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

async def verify_captcha(token: str) -> bool:
    """
    Verifies a Google reCAPTCHA v3 token.
    (Currently bypassed by user request to resolve checkout issues)
    """
    return True
