import asyncio
import random
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.product import Product
from app.models.user import User
from app.models.review import ProductReview

REVIEW_TEMPLATES = [
    {"rating": 5, "title": "Absolutely love it!", "content": "This is exactly what I was looking for. The quality is top-notch and it makes baking so much easier."},
    {"rating": 5, "title": "Highly recommended", "content": "I've tried many different brands but Whiffle is by far the best. The results are consistent every time."},
    {"rating": 4, "title": "Great quality", "content": "Very solid product. A bit more expensive than others but definitely worth the price for the durability."},
    {"rating": 5, "title": "Artisan quality", "content": "You can tell this was made for real bakers. The weight and finish are perfect."},
    {"rating": 4, "title": "Satisfied customer", "content": "Good product, arrived on time and works as described. Would buy again."},
    {"rating": 5, "title": "Kitchen essential", "content": "I don't know how I baked without this for so long. It's now my most used tool."},
    {"rating": 3, "title": "It's okay", "content": "Does the job, but I expected a bit more for the price. Still better than the cheap ones though."},
    {"rating": 5, "title": "Perfect gift", "content": "Bought this for my sister who is a professional baker and she absolutely loves it."},
    {"rating": 4, "title": "Beautiful design", "content": "Not only does it work well, it looks beautiful in my kitchen. Very premium feel."},
    {"rating": 5, "title": "Game changer", "content": "This improved my sourdough results significantly. The heat distribution is fantastic."},
]

USERNAMES = ["Sarah_Bakes", "Chef_Mike", "BakingEnthusiast", "PastryQueen", "TheBreadMaker", "SugarRush", "GlutenFreeGirl", "OvenMaster"]

async def seed_reviews():
    async with AsyncSessionLocal() as db:
        # 1. Ensure we have some users
        users = []
        for uname in USERNAMES:
            stmt = select(User).where(User.username == uname)
            res = await db.execute(stmt)
            user = res.scalar_one_or_none()
            if not user:
                user = User(
                    email=f"{uname.lower()}@example.com",
                    username=uname,
                    hashed_password="hashed_password", # Dummy
                    is_verified=True
                )
                db.add(user)
                await db.flush()
            users.append(user)
        
        # 2. Get all products
        stmt = select(Product)
        res = await db.execute(stmt)
        products = res.scalars().all()
        
        print(f"Found {len(products)} products. Seeding reviews...")
        
        # 3. Add random reviews to each product
        for product in products:
            # Add 3-7 reviews per product
            num_reviews = random.randint(3, 8)
            # Pick unique users for this product
            reviewing_users = random.sample(users, min(num_reviews, len(users)))
            
            for user in reviewing_users:
                # Check if review already exists
                stmt = select(ProductReview).where(
                    ProductReview.user_id == user.id,
                    ProductReview.product_id == product.id
                )
                res = await db.execute(stmt)
                if res.scalar_one_or_none():
                    continue
                
                template = random.choice(REVIEW_TEMPLATES)
                review = ProductReview(
                    user_id=user.id,
                    product_id=product.id,
                    rating=template["rating"],
                    title=template["title"],
                    content=template["content"]
                )
                db.add(review)
        
        await db.commit()
        print("Done seeding reviews!")

if __name__ == "__main__":
    asyncio.run(seed_reviews())
