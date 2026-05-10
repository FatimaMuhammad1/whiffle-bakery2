from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.newsletter import NewsletterSubscriber

router = APIRouter(prefix="/newsletter", tags=["Marketing"])

class SubscribeRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe")
async def subscribe(req: SubscribeRequest, db: AsyncSession = Depends(get_db)):
    # Check if already exists
    stmt = select(NewsletterSubscriber).where(NewsletterSubscriber.email == req.email)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.is_active:
            return {"message": "You are already subscribed!"}
        else:
            existing.is_active = True
            await db.commit()
            return {"message": "Subscription reactivated!"}
            
    new_sub = NewsletterSubscriber(email=req.email)
    db.add(new_sub)
    await db.commit()
    return {"message": "Successfully subscribed to our newsletter!"}
