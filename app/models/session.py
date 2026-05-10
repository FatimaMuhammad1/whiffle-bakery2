"""
app/models/session.py
──────────────────────
UserSession model — tracks active authenticated sessions.

Design decisions:
- Stored sessions complement JWT: they enable true server-side revocation
  (e.g., "logout everywhere", admin ban a user session)
- session_token is the value stored in the HTTP-only cookie
- ip_address and user_agent help with anomaly detection
- is_revoked allows soft deletion without breaking audit trails
- Redis will hold a hot cache of valid session tokens (Day 2);
  this table is the source of truth and audit log
"""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDMixin


class UserSession(UUIDMixin, Base):
    __tablename__ = "user_sessions"

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── Token ─────────────────────────────────────────────────────────────────
    # WHY: We use an opaque session token in addition to the JWT. 
    # This allows us to "revoke" a session immediately (e.g., if a device is stolen). 
    # Without this, a JWT is valid until it expires naturally.
    session_token: Mapped[str] = mapped_column(
        String(512),
        unique=True,
        nullable=False,
        index=True,
        comment="Opaque token stored in HTTP-only cookie",
    )

    # ── Client Info ───────────────────────────────────────────────────────────
    # WHY: Tracking IP and User-Agent helps with security auditing and 
    # anomaly detection (e.g., if a session suddenly jumps to a different country).
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # ── Lifecycle ─────────────────────────────────────────────────────────────
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    # WHY: is_revoked lets us instantly kill a session server-side.
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # ── Relationships ─────────────────────────────────────────────────────────
    user: Mapped["User"] = relationship(  # type: ignore[name-defined]
        "User", back_populates="sessions"
    )

    def __repr__(self) -> str:
        return f"<UserSession id={self.id} user={self.user_id} revoked={self.is_revoked}>"
