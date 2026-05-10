import httpx
from fastapi import HTTPException, status
from app.config import settings

RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

async def verify_captcha(token: str) -> bool:
    """
    Verifies a Google reCAPTCHA v3 token.
    Returns True if valid and score is above threshold.
    
    WHY: We use reCAPTCHA to distinguish between humans and bots. 
    This protects our checkout endpoint from automated 'brute-force' orders 
    or card-testing attacks.
    """
    if settings.is_development and (not token or token == "bypass-v3"):
        # WHY: In development, we allow bypassing CAPTCHA if no token is provided 
        # to make testing in the local environment or Postman easier.
        return True
            
    async with httpx.AsyncClient() as client:
        try:
            response = client.post(
                RECAPTCHA_VERIFY_URL,
                data={
                    "secret": settings.RECAPTCHA_SECRET_KEY,
                    "response": token,
                },
                timeout=5.0
            )
            # Wait for response since it's an async context but we need to await the call
            res = await response
            data = res.json()

            if not data.get("success"):
                return False

            # For reCAPTCHA v3, check the score
            score = data.get("score", 0.0)
            if score < settings.RECAPTCHA_SCORE_THRESHOLD:
                return False

            return True
        except Exception:
            # If verification service is down, we might want to fail-safe or fail-closed
            # Usually fail-closed for security, but depends on business requirements.
            return False
