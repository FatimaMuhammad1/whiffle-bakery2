"""
app/models/wishlist.py
───────────────────────
WishlistItem model — a many-to-many relationship between User and Product,
implemented as an explicit association table with extra metadata.

Design decisions:
- UniqueConstraint(user_id, product_id) prevents duplicate wishlist entries
  at the database level (not just application level)
- No UUID PK needed — integer autoincrement is fine for internal join records
- added_at lets us sort wishlist by "most recently added" on the frontend
"""
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    # WHY: UniqueConstraint prevents a user from adding the same product to their 
    # wishlist multiple times. It keeps the data clean at the database level.
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    # WHY: ondelete="CASCADE" ensures that if a User or Product is deleted, 
    # the wishlist records associated with them are also automatically deleted.
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── Metadata ──────────────────────────────────────────────────────────────
    # WHY: Tracking 'added_at' allows the frontend to sort the wishlist by 
    # the most recently saved items.
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    user: Mapped["User"] = relationship(  # type: ignore[name-defined]
        "User", back_populates="wishlist_items"
    )
    # WHY: 'joined' loading is used here so that when we fetch a user's wishlist, 
    # we get the full Product details (name, price, image) in a single SQL query.
    product: Mapped["Product"] = relationship(  # type: ignore[name-defined]
        "Product", back_populates="wishlist_items", lazy="joined"
    )

    def __repr__(self) -> str:
        return f"<WishlistItem user={self.user_id} product={self.product_id}>"
