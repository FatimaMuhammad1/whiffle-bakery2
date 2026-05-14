from sqlalchemy import String, Text, Integer, Column
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin

class Recipe(Base, TimestampMixin):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    prep_time: Mapped[str] = mapped_column(String(50), nullable=True)
    cook_time: Mapped[str] = mapped_column(String(50), nullable=True)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False, default="beginner")
    servings: Mapped[int] = mapped_column(Integer, nullable=True)
