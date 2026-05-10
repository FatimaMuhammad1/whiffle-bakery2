"""
app/models/order.py
────────────────────
Order and OrderItem models.

Design decisions:
- UUID PK for orders (public-facing — never expose sequential IDs in payment flows)
- status and payment_status use Python Enums → PostgreSQL ENUM types
- shipping_address stored as JSON (flexible for different address schemas)
- OrderItem records the unit_price AT TIME OF ORDER (products can change price later)
- subtotal is a computed/stored field for quick reporting
"""
import uuid
import enum
from decimal import Decimal

from sqlalchemy import (
    Enum,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class PaymentStatus(str, enum.Enum):
    unpaid = "unpaid"
    paid = "paid"
    refunded = "refunded"


class Order(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "orders"

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── State ─────────────────────────────────────────────────────────────────
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"),
        default=OrderStatus.pending,
        nullable=False,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        default=PaymentStatus.unpaid,
        nullable=False,
    )

    # ── Financial ─────────────────────────────────────────────────────────────
    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=0
    )
    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=0
    )
    shipping_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=0
    )
    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=0
    )

    # ── Shipping ──────────────────────────────────────────────────────────────
    shipping_address: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    user: Mapped["User"] = relationship(  # type: ignore[name-defined]
        "User", back_populates="orders", lazy="joined"
    )
    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Order id={self.id} status={self.status} total={self.total_amount}>"


class OrderItem(Base):
    """Line-item inside an Order. Stores price snapshot at time of purchase."""
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Foreign Keys ──────────────────────────────────────────────────────────
    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # ── Snapshot fields ───────────────────────────────────────────────────────
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)  # snapshot
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # ── Relationships ─────────────────────────────────────────────────────────
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship(  # type: ignore[name-defined]
        "Product", back_populates="order_items", lazy="joined"
    )

    def __repr__(self) -> str:
        return f"<OrderItem order={self.order_id} product={self.product_name} qty={self.quantity}>"
