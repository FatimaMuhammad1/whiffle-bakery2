from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class Recipe(Base, TimestampMixin):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)  # Markdown or HTML content
    image_url: Mapped[str | None] = mapped_column(String(500))
    prep_time: Mapped[str | None] = mapped_column(String(50))  # e.g. "20 mins"
    cook_time: Mapped[str | None] = mapped_column(String(50))
    difficulty: Mapped[str] = mapped_column(String(50), default="intermediate") # beginner, intermediate, advanced
    servings: Mapped[int | None] = mapped_column(Integer)
    
    author_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    
    def __repr__(self):
        return f"<Recipe {self.title}>"
