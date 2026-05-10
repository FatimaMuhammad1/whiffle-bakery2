import stripe
from app.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    @staticmethod
    async def create_payment_intent(amount: int, currency: str = "usd"):
        """
        Create a Stripe Payment Intent.
        Amount should be in cents (e.g., $10.00 = 1000).
        """
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                automatic_payment_methods={"enabled": True},
            )
            return intent
        except Exception as e:
            # Handle Stripe exceptions (e.g., CardError, RateLimitError)
            raise e

    @staticmethod
    async def verify_payment_intent(payment_intent_id: str, expected_amount_cents: int) -> bool:
        """
        Verify that a payment intent was successful and matches the expected amount.
        """
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            print(f"DEBUG: Verifying PaymentIntent {payment_intent_id}")
            print(f"DEBUG: Expected amount (cents): {expected_amount_cents}")
            print(f"DEBUG: Stripe intent amount (cents): {intent.amount}")
            print(f"DEBUG: Stripe intent status: {intent.status}")

            if intent.status != "succeeded":
                return False
            
            if intent.amount != expected_amount_cents:
                return False
                
            return True
        except Exception:
            return False
