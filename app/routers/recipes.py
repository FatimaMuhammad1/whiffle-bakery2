from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeResponse

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=List[RecipeResponse])
async def get_recipes(db: AsyncSession = Depends(get_db)):
    """List all recipes."""
    result = await db.execute(select(Recipe))
    recipes = result.scalars().all()
    return recipes

@router.get("/{slug}", response_model=RecipeResponse)
async def get_recipe_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a recipe by slug."""
    result = await db.execute(select(Recipe).filter_by(slug=slug))
    recipe = result.scalars().first()
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe
