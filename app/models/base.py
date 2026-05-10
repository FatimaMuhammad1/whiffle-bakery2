"""
app/models/base.py
──────────────────
Shared SQLAlchemy declarative base and mixins used by all models.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """
    All models inherit from this base.
    
    WHY: Centralizing models under a single DeclarativeBase allows SQLAlchemy 
    to keep track of all tables in the application. This is essential for 
    Alembic to automatically detect changes and generate migrations.
    """
    pass


class TimestampMixin:
    """
    Adds created_at and updated_at columns to any model.
    
    WHY: Auditing is critical for production apps. We need to know when 
    a user signed up, when a product was last updated, or when an order was placed.
    Using 'server_default' ensures the database handle the time, preventing 
    mismatches between application servers.
    """
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class UUIDMixin:
    """
    Adds a UUID primary key column.
    
    WHY: We use UUIDs for public-facing entities (Users, Orders) to prevent 
    'Insecure Direct Object Reference' (IDOR) attacks. If we used simple 
    integers (1, 2, 3), a malicious user could guess other users' IDs by 
    simply incrementing the number. UUIDs are impossible to guess.
    """
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
