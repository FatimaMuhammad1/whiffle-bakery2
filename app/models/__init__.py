"""
app/models/__init__.py
───────────────────────
Import all models here so Alembic's autogenerate can discover them
and SQLAlchemy's metadata is fully populated before migrations run.

Any new model file MUST be imported here.
"""
from app.models.base import Base  # noqa: F401 — must be first
from app.models.user import User, UserRole  # noqa: F401
from app.models.product import Category, Product  # noqa: F401
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus  # noqa: F401
from app.models.wishlist import WishlistItem  # noqa: F401
from app.models.otp import OTPCode, OTPPurpose  # noqa: F401
from app.models.session import UserSession  # noqa: F401
from app.models.reminder import BakingReminder  # noqa: F401
from app.models.review import ProductReview  # noqa: F401
from app.models.newsletter import NewsletterSubscriber  # noqa: F401
from app.models.recipe import Recipe  # noqa: F401

__all__ = [
    "Base",
    "User",
    "UserRole",
    "Category",
    "Product",
    "Order",
    "OrderItem",
    "OrderStatus",
    "PaymentStatus",
    "WishlistItem",
    "OTPCode",
    "OTPPurpose",
    "UserSession",
    "BakingReminder",
    "ProductReview",
    "NewsletterSubscriber",
    "Recipe",
]
