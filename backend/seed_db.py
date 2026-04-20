import uuid
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.models import (
    Profile,
    Community,
    Interest,
    Post,
    Item,
    PostType,
    ItemCategory,
    Ad,
    AdStatus,
    AdType,
    Base,
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:

        # 1. Interests
        interest_names = [
            "Boating",
            "Fishing",
            "Hiking",
            "Sailing",
            "Lake Conservation",
            "Kayaking",
            "Photography",
            "Water Sports",
            "Scuba Diving",
            "Beach Volleyball",
            "Camping",
            "Bird Watching",
            "Swimming",
            "Windsurfing",
            "Art & Culture",
        ]
        interests = []
        for name in interest_names:
            interest = db.query(Interest).filter(Interest.name == name).first()
            if not interest:
                interest = Interest(name=name)
                db.add(interest)
            interests.append(interest)
        db.flush()

        # 2. Communities - 10 Michigan Lake Communities
        communities_data = [
            {
                "name": "Spring Lake",
                "description": "A tranquil community nestled between Spring Lake and Lake Michigan, known for pristine beaches and excellent sailing.",
                "lake_name": "Spring Lake",
            },
            {
                "name": "Grand Haven",
                "description": "Famous for its iconic musical fountain, lighthouse, and vibrant downtown with shops and restaurants along the shore.",
                "lake_name": "Lake Michigan",
            },
            {
                "name": "Muskegon Lake",
                "description": "A hub for boating and fishing with great sunset views and a thriving arts community.",
                "lake_name": "Muskegon Lake",
            },
            {
                "name": "Torch Lake",
                "description": "Crystal clear waters surrounded by cottages and resorts, perfect for diving and water sports.",
                "lake_name": "Torch Lake",
            },
            {
                "name": "Cadillac Lake",
                "description": "Scenic northern Michigan lake with family-friendly amenities and excellent fishing spots.",
                "lake_name": "Cadillac Lake",
            },
            {
                "name": "Elk Lake",
                "description": "Peaceful pristine lake community ideal for kayaking, wildlife viewing, and nature photography.",
                "lake_name": "Elk Lake",
            },
            {
                "name": "Burt Lake",
                "description": "Michigan's second largest inland lake, perfect for sailing and large boat communities.",
                "lake_name": "Burt Lake",
            },
            {
                "name": "Paradise Lake",
                "description": "Small but charming lake community with tight-knit neighbors and seasonal activities.",
                "lake_name": "Paradise Lake",
            },
            {
                "name": "Portage Lake",
                "description": "Beautiful lake surrounded by dunes, waterfront dining, and outdoor recreation.",
                "lake_name": "Portage Lake",
            },
            {
                "name": "Suttons Bay",
                "description": "Scenic harbor town with vineyard views, galleries, and vibrant local culture.",
                "lake_name": "Grand Traverse Bay",
            },
        ]
        communities = []
        for cdata in communities_data:
            comm = db.query(Community).filter(Community.name == cdata["name"]).first()
            if not comm:
                comm = Community(**cdata)
                db.add(comm)
            communities.append(comm)
        db.flush()

        # 3. Generate 70+ Profiles
        first_names = [
            "James",
            "Sarah",
            "Michael",
            "Jessica",
            "David",
            "Emma",
            "Robert",
            "Olivia",
            "William",
            "Sophia",
            "Richard",
            "Isabella",
            "Joseph",
            "Mia",
            "Thomas",
            "Charlotte",
            "Charles",
            "Amelia",
            "Christopher",
            "Harper",
            "Daniel",
            "Evelyn",
            "Matthew",
            "Abigail",
            "Mark",
            "Elizabeth",
            "Donald",
            "Avery",
            "Steven",
            "Ella",
            "Paul",
            "Scarlett",
            "Andrew",
            "Victoria",
            "Joshua",
            "Madison",
            "Kenneth",
            "Grace",
            "Kevin",
            "Chloe",
            "Brian",
            "Camila",
            "George",
            "Ariana",
            "Edward",
            "Aurora",
            "Ronald",
            "Lily",
            "Anthony",
            "Zoe",
            "Frank",
            "Violet",
            "Ryan",
            "Layla",
            "Gary",
            "Riley",
            "Nicholas",
            "Nora",
            "Eric",
            "Eleanor",
            "Jonathan",
            "Sarah",
            "Stephen",
            "Ashley",
            "Larry",
            "Britney",
            "Justin",
            "Miranda",
            "Scott",
            "Destiny",
            "Brandon",
            "Paisley",
        ]
        last_names = [
            "Murphy",
            "O'Brien",
            "Sullivan",
            "Walsh",
            "Ryan",
            "McCarthy",
            "Kennedy",
            "Fitzgerald",
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
            "Davis",
            "Rodriguez",
            "Martinez",
            "Hernandez",
            "Lopez",
            "Gonzalez",
            "Wilson",
            "Anderson",
            "Thomas",
            "Taylor",
            "Moore",
            "Jackson",
            "Martin",
            "Lee",
            "Perez",
            "Thompson",
            "White",
            "Harris",
            "Sanchez",
            "Clark",
            "Ramirez",
            "Lewis",
            "Robinson",
            "Young",
            "Alonso",
            "Walker",
            "Green",
            "Hall",
            "Allen",
            "King",
            "Wright",
            "Scott",
            "Torres",
            "Peterson",
            "Phillips",
            "Campbell",
            "Parker",
            "Evans",
            "Edwards",
            "Collins",
            "Reeves",
            "Stewart",
        ]
        business_names = [
            "Marina Pro Rentals",
            "Lake Fishing Co.",
            "Waterfront Bistro",
            "Sunset Yacht Club",
            "Beach Pizza Kitchen",
            "Water Sports Central",
            "Lakeside Lodge",
            "Harbor Master Repairs",
            "Scenic Boat Tours",
            "Dock & Dine",
            "Adventure Outfitters",
            "Cozy Falls Cafe",
            "Pier Side Pub",
            "Clear Water Supplies",
            "Dune Buggy Rentals",
            "Waterfront Hotel",
            "Pontoon Tours Inc",
            "Fishing Charter Services",
            "Lakeside Rentals",
            "Harbor Bar & Grill",
        ]

        profile_data = []
        # Create business profiles
        for i, bname in enumerate(business_names[:8]):
            profile_data.append(
                {
                    "id": uuid.uuid4(),
                    "username": bname.replace(" ", "").replace("&", ""),
                    "email": f"contact@{bname.lower().replace(' ', '')}.com",
                    "bio": f"Your local experts in {bname}. Serving Michigan lake communities with pride.",
                    "address": f"{random.randint(100, 999)} Waterfront Dr, {random.choice(communities_data)['name']}, MI",
                    "is_business": True,
                    "business_name": bname,
                    "profile_image_url": random.choice(
                        [
                            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",  # Yacht
                            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop",  # Restaurant
                            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop",  # Hotel
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",  # Cafe
                        ]
                    ),
                }
            )

        # Create personal profiles
        for i in range(65):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            profile_data.append(
                {
                    "id": uuid.uuid4(),
                    "username": f"{fname}{lname}{random.randint(100, 999)}",
                    "email": f"{fname.lower()}.{lname.lower()}{random.randint(1, 999)}@example.com",
                    "bio": random.choice(
                        [
                            f"Lake lover and {random.choice(['boating', 'fishing', 'kayaking', 'sailing'])} enthusiast living on the water.",
                            f"Retired {random.choice(['teacher', 'engineer', 'nurse', 'captain', 'chef'])} enjoying Michigan summers.",
                            f"Family of {random.randint(2, 5)} looking for community and outdoor adventures.",
                            f"Professional photographer capturing beautiful sunsets over the lake.",
                            f"Fisherman and conservationist passionate about keeping our lakes pristine.",
                            f"Water sports instructor and adventure seeker.",
                        ]
                    ),
                    "address": f"{random.randint(100, 9999)} {random.choice(['Lake', 'Shore', 'Water', 'Beach', 'Pier', 'Dock'])} Road, {random.choice(communities_data)['name']}, MI {random.randint(49000, 49999)}",
                    "is_business": False,
                    "profile_image_url": random.choice(
                        [
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",  # Profile 1
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",  # Profile 2
                            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",  # Profile 3
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",  # Profile 4
                            "https://images.unsplash.com/photo-1507009335-3ff003f2d98a?w=400&h=400&fit=crop",  # Profile 5
                        ]
                    ),
                }
            )

        profiles = []
        for pdata in profile_data:
            existing = (
                db.query(Profile).filter(Profile.username == pdata["username"]).first()
            )
            if not existing:
                p = Profile(**pdata)
                # Assign 2-4 interests
                p.interests = random.sample(interests, random.randint(2, 4))
                # Assign to 1-2 communities
                p.communities = random.sample(communities, random.randint(1, 2))
                db.add(p)
                profiles.append(p)
            else:
                profiles.append(existing)
        db.flush()

        # 4. Posts (80+)
        post_contents = {
            "event": [
                "Community beach cleanup this Saturday at 9 AM. All welcome! Bring your own bags and gloves.",
                "Annual lake festival coming up! Live music, food vendors, and water sports demonstrations.",
                "Sailing lessons for beginners every Tuesday evening at the marina. Sign up today!",
                "Fish fry tonight at the community center. $15 per plate, proceeds go to lake conservation.",
                "Sunrise yoga class on the beach every Wednesday morning. Bring your own mat!",
                "Movie night by the dock this Friday. Bring blankets and snacks. Showing 'Jaws'!",
                "Monthly wine tasting at the harbor bar. Local wineries featured this month.",
                "Kids' fishing contest next weekend. Prizes for the biggest catch!",
            ],
            "announcement": [
                "Lake water quality alert: Algae bloom detected. Avoid swimming in northern section.",
                "Road construction on Waterfront Drive through next month. Plan alternative routes.",
                "New boat launch facility now open at Marina Point. Modern amenities available.",
                "Community speed limit enforcement this weekend. Please observe 45mph on Lake Road.",
                "Winter boat storage discounts available through December. Call the marina for details.",
                "New fishing regulations in effect. Purchase your updated guide at the dock.",
                "Beach volleyball nets going up this week. Join our league!",
                "Community dock renovation completed. Grand opening celebration planned.",
            ],
            "general": [
                "Such a beautiful sunset over the lake today! Never gets old.",
                "Anyone know good spots for walleye fishing around here?",
                "Just spotted a bald eagle near Sunset Point. Nature is amazing!",
                "Looking for recommendations on boat maintenance services.",
                "Our dock is finally repaired after the winter damage. Summer is here!",
                "Has anyone tried that new restaurant on the pier? Thinking about going this weekend.",
                "Beautiful weather this week - perfect for getting out on the water.",
                "Lost dog near the beach yesterday - family is heartbroken. Please keep an eye out.",
                "Found a wallet by the dock - has someone's fishing license in it.",
                "Who wants to join our boat club? We meet monthly for outings.",
                "The lake is so calm this morning - best day for paddleboarding all month.",
                "Just finished my new boat and ready for its maiden voyage!",
            ],
        }

        post_titles = {
            "event": [
                "Beach Cleanup Drive - This Saturday",
                "Annual Lake Festival Coming Up",
                "Free Sailing Lessons Starting",
                "Community Fish Fry Tonight",
                "Sunrise Yoga on the Beach",
                "Outdoor Movie Night",
                "Wine Tasting at the Harbor",
                "Kids Fishing Contest",
                "Community Bonfire Planned",
                "Outdoor Art Show",
            ],
            "announcement": [
                "Water Quality Alert",
                "Road Construction Update",
                "New Boat Launch Facility Open",
                "Speed Limit Enforcement",
                "Winter Storage Discounts",
                "Updated Fishing Regulations",
                "Volleyball League Starting",
                "Dock Renovation Complete",
                "New Marina Hours",
                "Park Maintenance Notice",
            ],
            "general": [
                "Beautiful Sunset Tonight",
                "Walleye Fishing Tips Needed",
                "Eagle Sighting at Sunset Point",
                "Boat Maintenance Recommendations?",
                "Finally Got My Dock Fixed",
                "New Restaurant on Pier",
                "Perfect Weather for Water Sports",
                "Lost Dog - Please Help",
                "Found Wallet at Dock",
                "Join Our Boat Club",
                "Gorgeous Morning Conditions",
                "New Boat Maiden Voyage",
                "Lake Conservation Discussion",
                "Water Safety Tips",
                "Cottage Rentals Available",
            ],
        }

        all_post_types = []
        for post_type_name in post_titles.keys():
            for _ in range(4):  # Create mult posts of each type
                all_post_types.append(post_type_name)

        for i in range(85):
            author = random.choice(profiles)
            community = (
                random.choice(author.communities)
                if author.communities
                else random.choice(communities)
            )
            post_type = random.choice(list(PostType))

            if post_type.value == "event":
                title = random.choice(post_titles.get("event", ["Community Event"]))
                content = random.choice(
                    post_contents.get("event", ["Check out this event!"])
                )
            elif post_type.value == "announcement":
                title = random.choice(post_titles.get("announcement", ["Announcement"]))
                content = random.choice(
                    post_contents.get("announcement", ["Important update"])
                )
            else:
                title = random.choice(post_titles.get("general", ["Great Day"]))
                content = random.choice(
                    post_contents.get("general", ["Check this out"])
                )

            post = Post(
                title=title,
                content=content,
                post_type=post_type,
                author_id=author.id,
                community_id=community.id,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 60)),
            )
            db.add(post)

        # 5. Items (Marketplace) - 75+
        boat_models = [
            (
                "Pontoon Boat 2020",
                "22000",
                "Well maintained with new upholstery, perfect for family outings.",
            ),
            (
                "Fishing Boat 2018",
                "18500",
                "Center console, equipped with trolling motor and fish finder.",
            ),
            (
                "Speed Boat 2022",
                "35000",
                "High performance with recent engine service, seats 6 comfortably.",
            ),
            (
                "Sailboat 25ft",
                "15000",
                "Classic sailboat, recently refurbished, great for racing or cruising.",
            ),
            (
                "Jet Ski 2021",
                "8500",
                "Excellent condition, garage kept, low hours on engine.",
            ),
            (
                "Kayak Trio Set",
                "900",
                "Three tandem fishing kayaks with paddles included, lightly used.",
            ),
            (
                "Canoe",
                "350",
                "16ft aluminum canoe, perfect for peaceful lake exploration.",
            ),
            (
                "Catamaran",
                "42000",
                "Twin hull design, perfect for shallow water exploration and stability.",
            ),
            (
                "Houseboat 35ft",
                "80000",
                "Fully equipped with kitchen, sleeping areas, and bathroom. Turnkey!",
            ),
            (
                "PWC Waverunner",
                "9500",
                "2023 model, serviced annually, very well maintained.",
            ),
        ]

        fishing_items = [
            (
                "Shimano Fishing Rod Set",
                "125",
                "Carbon fiber, 7ft, perfect for bass and walleye fishing.",
            ),
            (
                "Abu Garcia Reel",
                "85",
                "High-speed baitcaster with smooth drag, like new condition.",
            ),
            (
                "Fishing Tackle Box",
                "45",
                "Organized 5-tray tackle box with 200+ lures and weights.",
            ),
            (
                "Live Bait Well System",
                "300",
                "Portable aerator system for keeping bait fresh all day.",
            ),
            (
                "Fish Finder Echo Map",
                "350",
                "Latest wireless technology, pre-loaded with local lake maps.",
            ),
            (
                "Cooler with Rod Holder",
                "120",
                "Insulated 70qt cooler with built-in rod holder, perfect tackle storage.",
            ),
            (
                "Cast Net (4ft)",
                "40",
                "Hand braided cast net, great condition, easy to throw and retrieve.",
            ),
            (
                "Night Fishing Lights",
                "60",
                "LED underwater lights, attract fish at night, battery powered.",
            ),
            (
                "Shimano Spinning Reel",
                "95",
                "Smooth operation, excellent for general lake fishing.",
            ),
            (
                "Pro Series Lure Collection",
                "150",
                "200 piece collection of premium bass, pike, and walleye lures.",
            ),
        ]

        water_sports = [
            (
                "Liquid Wakeboard Set",
                "450",
                "Professional wakeboard with boots, used 2 seasons, excellent condition.",
            ),
            (
                "Stand-Up Paddleboard",
                "380",
                "11ft board, includes paddle and leash, great for beginners or pros.",
            ),
            (
                "Surfboard Collection",
                "600",
                "3 surfboards, various sizes, one brand new never used.",
            ),
            (
                "Windsurfing Board",
                "320",
                "Complete setup with sail and boom, perfect for windy days.",
            ),
            (
                "Snorkel Gear Set",
                "75",
                "Mask, snorkel, fins, and bag included, lightly worn.",
            ),
            (
                "Scuba Tank Set",
                "200",
                "Two tanks, regulator, and pressure gauge, recently inspected.",
            ),
            (
                "Inflatable Raft",
                "280",
                "6-person capacity, comes with oars and air pump.",
            ),
            (
                "Water Skis",
                "220",
                "Pair of slalom skis with tow rope, good condition, fun for all levels.",
            ),
            (
                "Bodyboard",
                "60",
                "Great for younger swimmers and beachgoers learning water safety.",
            ),
            (
                "Life Jacket Collection",
                "150",
                "Set of 5 USCG approved jackets, various sizes and colors.",
            ),
        ]

        equipment_items = [
            (
                "Marine Sealant & Supplies",
                "85",
                "Bulk lot of caulk, marine grease, and maintenance products.",
            ),
            (
                "Anchor Kit",
                "95",
                "50lb mushroom anchor with chain and rope, heavy duty.",
            ),
            (
                "Navigation GPS Unit",
                "200",
                "Handheld marine GPS, waterproof, includes maps and case.",
            ),
            (
                "Boat Cover",
                "150",
                "Custom fit for 20ft boat, UV resistant, comes with storage bag.",
            ),
            (
                "Fenders (Pair)",
                "40",
                "Inflatable boat fenders in excellent condition, protect your hull.",
            ),
            (
                "Docking Lines Set",
                "50",
                "Heavy duty marine rope, 200ft total length, UV resistant.",
            ),
            (
                "Bilge Pump",
                "120",
                "Electric bilge pump with float switch, keeps your boat dry.",
            ),
            (
                "Marine Battery 2pc",
                "180",
                "Two deep-cycle batteries, perfect for larger boats.",
            ),
            (
                "Navigation Lights",
                "110",
                "LED bow lights, very bright, installed on quality boat.",
            ),
            (
                "Propeller (13x19)",
                "165",
                "Stainless steel propeller for saltwater use, perfect fit.",
            ),
        ]

        vehicles = [
            (
                "Truck 2019 Ford F-150",
                "28000",
                "Crew cab, 4WD, perfect for towing your boat to lakes.",
            ),
            (
                "Trailer 2-Axle Boat",
                "3500",
                "Galvanized steel, rated for 5000lb load, excellent condition.",
            ),
            (
                "ATV 2022 Yamaha",
                "9000",
                "Rarely used, garage kept, perfect for beach and trail riding.",
            ),
            (
                "UTV 2021 Can-Am",
                "16000",
                "Side-by-side, great for exploring properties along the lake.",
            ),
            (
                "Hitch Receiver Set",
                "75",
                "Towing hitch setup with safety chains and lock kit.",
            ),
        ]

        # Combine all items
        all_items = (
            boat_models + fishing_items + water_sports + equipment_items + vehicles
        )

        item_categories = {
            "boat": ItemCategory.BOAT,
            "fishing": ItemCategory.EQUIPMENT,
            "sports": ItemCategory.WATER_TOY,
            "equipment": ItemCategory.EQUIPMENT,
            "vehicle": ItemCategory.VEHICLE,
        }

        item_images = {
            "boat": [
                "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",  # Boat
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",  # Sailboat
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",  # Speed boat
            ],
            "fishing": [
                "https://images.unsplash.com/photo-1583286333379-46a8f5d3f57d?w=600&h=400&fit=crop",  # Fishing
                "https://images.unsplash.com/photo-1553632171-c4306e0c04ca?w=600&h=400&fit=crop",  # Fishing
            ],
            "sports": [
                "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop",  # Surfing
                "https://images.unsplash.com/photo-1610374119267-bb4ffe8b4df9?w=600&h=400&fit=crop",  # Paddleboard
                "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",  # Skiing
            ],
            "equipment": [
                "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop",  # Equipment
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",  # Anchor
            ],
            "vehicle": [
                "https://images.unsplash.com/photo-1609708536965-9ddab47d1011?w=600&h=400&fit=crop",  # Truck
                "https://images.unsplash.com/photo-1552813747-c26f80d46a55?w=600&h=400&fit=crop",  # Trailer
            ],
        }

        for item_name, price, description in all_items:
            owner = random.choice([p for p in profiles if not p.is_business])

            # Determine category
            if (
                "boat" in item_name.lower()
                or "sailboat" in item_name.lower()
                or "pontoon" in item_name.lower()
                or "houseboat" in item_name.lower()
                or "catamaran" in item_name.lower()
                or "jet ski" in item_name.lower()
                or "pwc" in item_name.lower()
            ):
                category = ItemCategory.BOAT
                image = random.choice(item_images["boat"])
            elif (
                "fish" in item_name.lower()
                or "rod" in item_name.lower()
                or "reel" in item_name.lower()
                or "tackle" in item_name.lower()
            ):
                category = ItemCategory.EQUIPMENT
                image = random.choice(item_images["fishing"])
            elif (
                "paddle" in item_name.lower()
                or "surf" in item_name.lower()
                or "ski" in item_name.lower()
                or "wake" in item_name.lower()
                or "kayak" in item_name.lower()
                or "canoe" in item_name.lower()
            ):
                category = ItemCategory.WATER_TOY
                image = random.choice(item_images["sports"])
            elif (
                "truck" in item_name.lower()
                or "trailer" in item_name.lower()
                or "atv" in item_name.lower()
                or "utv" in item_name.lower()
            ):
                category = ItemCategory.VEHICLE
                image = random.choice(item_images["vehicle"])
            else:
                category = ItemCategory.EQUIPMENT
                image = random.choice(item_images["equipment"])

            item = Item(
                name=item_name,
                price=price,
                description=description,
                owner_id=owner.id,
                image=image,
                category=category,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 45)),
            )
            db.add(item)

        # 6. Ads
        ad_data = [
            {
                "title": "Spring Lake Marina - 20% Off Docking!",
                "body": "Limited time offer on seasonal docking. New slips available with full amenities.",
                "ad_type": AdType.POST,
            },
            {
                "title": "Grand Haven Pizza Factory",
                "body": "Lakefront dining with a view. Perfect for families and groups. Daily specials!",
                "ad_type": AdType.POST,
            },
            {
                "title": "Torch Lake Boat Rentals",
                "body": "Rent pontoons, jet skis, and fishing boats. Professional guides available.",
                "ad_type": AdType.MARKETPLACE,
            },
            {
                "title": "Cadillac Lake Fishing Charters",
                "body": "Guided fishing tours for walleye and bass. All equipment provided.",
                "ad_type": AdType.MARKETPLACE,
            },
            {
                "title": "Lakeside Cottage Rentals",
                "body": "Beautiful waterfront cottages available weekly. Book your summer now!",
                "ad_type": AdType.POST,
            },
            {
                "title": "Water Safety Certification Program",
                "body": "USCG approved boating safety courses. Discounts for groups.",
                "ad_type": AdType.MARKETPLACE,
            },
            {
                "title": "Elk Lake Environmental Conservation",
                "body": "Join our efforts to keep our lakes clean and pristine for future generations.",
                "ad_type": AdType.POST,
            },
            {
                "title": "Burt Lake Fine Dining",
                "body": "Award-winning seafood restaurant overlooking the water. Reservations recommended.",
                "ad_type": AdType.POST,
            },
            {
                "title": "Paradise Lake Boat Repair & Maintenance",
                "body": "Expert mechanics ready to service any watercraft. Fast turnaround times.",
                "ad_type": AdType.MARKETPLACE,
            },
            {
                "title": "Portage Lake Water Sports Academy",
                "body": "Learn wakeboarding, water skiing, and paddleboarding from certified instructors.",
                "ad_type": AdType.MARKETPLACE,
            },
            {
                "title": "Suttons Bay Vineyard Tours",
                "body": "Scenic boat tours followed by local wine tasting. Groups welcome!",
                "ad_type": AdType.POST,
            },
            {
                "title": "Michigan Lake Conservation Foundation",
                "body": "Support our mission to protect and preserve Michigan's beautiful lakes.",
                "ad_type": AdType.POST,
            },
        ]

        for adata in ad_data:
            owner = random.choice([p for p in profiles if p.is_business])
            ad = Ad(
                **adata,
                owner_id=owner.id,
                status=AdStatus.APPROVED,
                image=random.choice(
                    [
                        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
                        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                    ]
                ),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7)),
            )
            db.add(ad)

        db.commit()
        print(f"✓ Seeded {len(profiles)} profiles")
        print(f"✓ Seeded {len(communities)} communities")
        print(f"✓ Seeded 85+ posts")
        print(f"✓ Seeded 75+ marketplace items")
        print(f"✓ Seeded {len(ad_data)} advertisements")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
