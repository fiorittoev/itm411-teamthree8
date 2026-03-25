import uuid
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.models import (
    Profile, Community, Interest, Post, Item, 
    PostType, ItemCategory, Ad, AdStatus, AdType, Base
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        print("Seeding database...")

        # 1. Interests
        interest_names = ["Boating", "Fishing", "Hiking", "Sailing", "Lake Conservation", "Kayaking", "Photography"]
        interests = []
        for name in interest_names:
            interest = db.query(Interest).filter(Interest.name == name).first()
            if not interest:
                interest = Interest(name=name)
                db.add(interest)
            interests.append(interest)
        db.flush()

        # 2. Communities
        communities_data = [
            {"name": "Spring Lake", "description": "A tranquil community nestled between Spring Lake and Lake Michigan.", "lake_name": "Spring Lake"},
            {"name": "Grand Haven", "description": "Famous for its pier, lighthouse, and vibrant downtown atmosphere.", "lake_name": "Lake Michigan"},
            {"name": "Muskegon Lake", "description": "A hub for boating and fishing with great sunset views.", "lake_name": "Muskegon Lake"},
        ]
        communities = []
        for cdata in communities_data:
            comm = db.query(Community).filter(Community.name == cdata["name"]).first()
            if not comm:
                comm = Community(**cdata)
                db.add(comm)
            communities.append(comm)
        db.flush()

        # 3. Profiles
        # Generate some dummy UUIDs (since these aren't linked to real Supabase users)
        profile_data = [
            {
                "id": uuid.uuid4(),
                "username": "JaneSmith",
                "email": "jane@example.com",
                "bio": "Avid boater and lover of Spring Lake sunsets.",
                "address": "123 Lakeside Dr, Spring Lake, MI",
                "is_business": False
            },
            {
                "id": uuid.uuid4(),
                "username": "CaptainJohn",
                "email": "john@example.com",
                "bio": "Retired coast guard, now enjoying life on the pier.",
                "address": "456 Pier View, Grand Haven, MI",
                "is_business": False
            },
            {
                "id": uuid.uuid4(),
                "username": "SpringLakeMarina",
                "email": "info@slmarina.com",
                "bio": "Your full-service marina for all things boater.",
                "address": "100 Marina Way, Spring Lake, MI",
                "is_business": True,
                "business_name": "Spring Lake Marina"
            },
            {
                "id": uuid.uuid4(),
                "username": "BistroByTheLake",
                "email": "hello@lakebistro.com",
                "bio": "Serving the best lakefront pizza in Muskegon.",
                "address": "789 Shoreline Blvd, Muskegon, MI",
                "is_business": True,
                "business_name": "The Lakeview Bistro"
            }
        ]
        
        profiles = []
        for pdata in profile_data:
            existing = db.query(Profile).filter(Profile.username == pdata["username"]).first()
            if not existing:
                p = Profile(**pdata)
                # Assign some interests and communities
                p.interests = random.sample(interests, 2)
                p.communities = [random.choice(communities)]
                db.add(p)
                profiles.append(p)
            else:
                profiles.append(existing)
        db.flush()

        # 4. Posts
        post_titles = [
            "Beautiful sunset today!",
            "Anyone seen a lost golden retriever?",
            "Community cleanup next Saturday",
            "Great deals on boat winterization",
            "New summer menu is out!",
            "Fishing report: Bass are biting near the bridge."
        ]
        
        for i in range(10):
            author = random.choice(profiles)
            comm = author.communities[0] if author.communities else random.choice(communities)
            post = Post(
                title=random.choice(post_titles),
                content="This is a sample post about our wonderful Michigan lake community. " + 
                        "Stay safe on the water and enjoy the view!",
                post_type=random.choice(list(PostType)),
                author_id=author.id,
                community_id=comm.id,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            db.add(post)

        # 5. Items (Marketplace)
        item_data = [
            {"name": "Old Town Kayak", "price": "450", "description": "Gently used, perfect for shoreline exploring.", "category": ItemCategory.WATER_TOY},
            {"name": "Shimano Fishing Rod", "price": "75", "description": "High quality carbon fiber rod.", "category": ItemCategory.EQUIPMENT},
            {"name": "Life Jackets (Set of 4)", "price": "100", "description": "USCG approved, mixed sizes.", "category": ItemCategory.EQUIPMENT},
            {"name": "Pontoon Boat (2018)", "price": "22000", "description": "Well maintained, 90HP engine.", "category": ItemCategory.BOAT},
        ]

        for idata in item_data:
            owner = random.choice([p for p in profiles if not p.is_business])
            item = Item(
                **idata,
                owner_id=owner.id,
                image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" # Dummy pixel
            )
            db.add(item)

        # 6. Ads
        ad_data = [
            {"title": "Spring Sale at the Marina!", "body": "Get 20% off all docking fees this month.", "ad_type": AdType.POST},
            {"title": "New Pizza Special", "body": "Try our 'Lake Monster' deep dish. Huge savings on weekdays.", "ad_type": AdType.POST},
            {"title": "Custom Lake Maps", "body": "Order your personalized wood-carved lake map today.", "ad_type": AdType.MARKETPLACE},
        ]

        for adata in ad_data:
            owner = random.choice([p for p in profiles if p.is_business])
            ad = Ad(
                **adata,
                owner_id=owner.id,
                status=AdStatus.APPROVED,
                created_at=datetime.utcnow() - timedelta(days=2)
            )
            db.add(ad)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
