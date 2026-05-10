from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.recipe import Recipe
from app.dependencies.admin import admin_required

router = APIRouter(prefix="/recipes", tags=["Recipes"])

class RecipeBase(BaseModel):
    title: str
    slug: str
    description: str
    content: str
    image_url: Optional[str] = None
    prep_time: Optional[str] = None
    cook_time: Optional[str] = None
    difficulty: str = "intermediate"
    servings: Optional[int] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: int
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[RecipeResponse])
async def get_recipes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe).order_by(Recipe.created_at.desc()))
    return result.scalars().all()

@router.get("/{slug}", response_model=RecipeResponse)
async def get_recipe_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe).where(Recipe.slug == slug))
    recipe = result.scalars().first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@router.post("/", response_model=RecipeResponse)
async def create_recipe(
    recipe_in: RecipeCreate, 
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    # Check if slug exists
    existing = await db.execute(select(Recipe).where(Recipe.slug == recipe_in.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    recipe = Recipe(**recipe_in.model_dump())
    db.add(recipe)
    await db.commit()
    await db.refresh(recipe)
    return recipe

@router.patch("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_in: RecipeCreate,
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    for key, value in recipe_in.model_dump().items():
        setattr(recipe, key, value)
    
    await db.commit()
    await db.refresh(recipe)
    return recipe

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: int,
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    await db.delete(recipe)
    await db.commit()
    return None
