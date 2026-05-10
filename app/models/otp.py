"""
app/models/otp.py
──────────────────
OTPCode model — stores one-time passwords for email verification,
password reset, and optional 2FA.

Design decisions:
- code is HASHED before storage (same principle as passwords) — the raw
  code is only ever shown to the user once via email/SMS
- purpose enum makes this table reusable for multiple OTP flows
- expires_at enforced at DB query time: "WHERE expires_at > NOW() AND is_used = FALSE"
- On new OTP request, old unused codes for the same user+purpose should be
  invalidated (handled in the service layer, Day 2)
"""
import uuid
import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class OTPPurpose(str, enum.Enum):
    email_verify = "email_verify"
    password_reset = "password_reset"
    login_2fa = "login_2fa"


class OTPCode(Base):
    __tablename__ = "otp_codes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── OTP Data ──────────────────────────────────────────────────────────────
    # WHY: We hash the OTP code (just like a password). 
    # If the database is compromised, the attacker cannot see the active 
    # verification codes because they are hashed.
    hashed_code: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="bcrypt hash of the raw OTP — never store plaintext",
    )
    # WHY: A single table handles verification for signups, password resets, 
    # and 2FA, keeping the database schema lean.
    purpose: Mapped[OTPPurpose] = mapped_column(
        Enum(OTPPurpose, name="otp_purpose"),
        nullable=False,
        index=True,
    )

    # ── Lifecycle ─────────────────────────────────────────────────────────────
    # WHY: OTPs must be short-lived (e.g., 10 minutes) to reduce the window 
    # of opportunity for an attacker to guess them.
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    # WHY: Once a code is used, it should never work again (preventing replay attacks).
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # ── Relationships ─────────────────────────────────────────────────────────
    user: Mapped["User"] = relationship(  # type: ignore[name-defined]
        "User", back_populates="otp_codes"
    )

    def __repr__(self) -> str:
        return f"<OTPCode id={self.id} purpose={self.purpose} used={self.is_used}>"
