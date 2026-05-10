"""
app/models/user.py
──────────────────
User model — stores account info, authentication state, and role.

Design decisions:
- UUID primary key (safer for public-facing IDs, prevents enumeration)
- email and username are unique + indexed for fast lookups
- hashed_password is never exposed (handled in service layer)
- role uses a Python Enum mapped to a PostgreSQL ENUM type
- is_verified controls OTP-gated features (checkout, wishlist, etc.)
"""
import uuid
import enum

from sqlalchemy import Boolean, Enum, String, Index, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class UserRole(str, enum.Enum):
    customer = "customer"
    admin = "admin"


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    # ── Identity ──────────────────────────────────────────────────────────────
    # WHY: We use String(255) to be compatible with most email standards.
    # Indexed for lightning-fast logins.
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    username: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    # WHY: We store a hash, never the raw password. Even if the DB is leaked, 
    # passwords remain secure.
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # ── State ─────────────────────────────────────────────────────────────────
    # WHY: is_active allows us to ban users without deleting their data (preserving history).
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # WHY: is_verified tracks if the user has completed email/OTP verification.
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # WHY: two_factor_enabled controls if the user needs OTP after password.
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # WHY: points tracks 'Baker Points' earned through engagement or purchases.
    points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ── Shipping Defaults ─────────────────────────────────────────────────────
    full_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    zip: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # ── Role ──────────────────────────────────────────────────────────────────
    # WHY: Enum ensures that roles are restricted to 'admin' or 'customer' at the DB level.
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        default=UserRole.customer,
        nullable=False,
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    # WHY: 'selectin' loading is used for collections to avoid the 'N+1' query problem 
    # (it fetches all related items in a second, efficient query).
    # WHY: cascade="all, delete-orphan" ensures that if a user is deleted, 
    # their orders and wishlists are cleaned up automatically.
    orders: Mapped[list["Order"]] = relationship(  # type: ignore[name-defined]
        "Order", back_populates="user", lazy="selectin", cascade="all, delete-orphan"
    )
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(  # type: ignore[name-defined]
        "WishlistItem", back_populates="user", lazy="selectin", cascade="all, delete-orphan"
    )
    reminders: Mapped[list["BakingReminder"]] = relationship(  # type: ignore[name-defined]
        "BakingReminder", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )
    # WHY: cascade="all, delete-orphan" ensures that if a user is deleted, 
    # their OTPs and Sessions are cleaned up automatically.
    otp_codes: Mapped[list["OTPCode"]] = relationship(  # type: ignore[name-defined]
        "OTPCode", back_populates="user", cascade="all, delete-orphan"
    )
    sessions: Mapped[list["UserSession"]] = relationship(  # type: ignore[name-defined]
        "UserSession", back_populates="user", cascade="all, delete-orphan"
    )
    reviews: Mapped[list["ProductReview"]] = relationship(  # type: ignore[name-defined]
        "ProductReview", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
