"""
app/models/product.py
──────────────────────
Category and Product models.

Design decisions:
- Integer PKs for categories and products (simpler, sequential, fine for
  internal entities that don't appear in public URLs)
- slug is unique and indexed — used in frontend-friendly URLs (/products/croissant)
- price uses Numeric(10, 2) to avoid floating-point rounding errors
- stock_quantity enables inventory management
- is_available is a soft "on/off" toggle separate from stock
"""
import enum
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Category(TimestampMixin, Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    products: Mapped[list["Product"]] = relationship(
        "Product", back_populates="category", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Category id={self.id} name={self.name}>"


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    category_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ── Core Fields ───────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    # WHY: slugs are used in URLs (e.g., /products/chocolate-cake) instead of IDs.
    # This is better for SEO and user experience.
    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # WHY: Numeric(10, 2) is used for currency to avoid the precision errors 
    # that occur with floating-point numbers (0.1 + 0.2 != 0.3).
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    # WHY: stock_quantity allows the system to automatically block sales when out of stock.
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # WHY: images array allows storing multiple angles/shots of the same product.
    images: Mapped[list[str] | None] = mapped_column(
        "images", type_=JSON, nullable=True, server_default="[]"
    )
    # WHY: is_available lets admins hide a product without deleting it (e.g., seasonal items).
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # ── Relationships ─────────────────────────────────────────────────────────
    # WHY: 'joined' loading is used for the category because every product 
    # usually belongs to one category, and fetching them together is efficient.
    category: Mapped["Category"] = relationship(
        "Category", back_populates="products", lazy="joined"
    )
    order_items: Mapped[list["OrderItem"]] = relationship(  # type: ignore[name-defined]
        "OrderItem", back_populates="product"
    )
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(  # type: ignore[name-defined]
        "WishlistItem", back_populates="product"
    )
    reviews: Mapped[list["ProductReview"]] = relationship(  # type: ignore[name-defined]
        "ProductReview", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Product id={self.id} name={self.name} price={self.price}>"
