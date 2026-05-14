from pydantic import BaseModel
from typing import Optional

class RecipeBase(BaseModel):
    title: str
    slug: str
    description: str
    content: str
    image_url: Optional[str] = None
    prep_time: Optional[str] = None
    cook_time: Optional[str] = None
    difficulty: str
    servings: Optional[int] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: int

    class Config:
        from_attributes = True
