from sqlalchemy import (
    Column,
    String,
    Text,
    TIMESTAMP,
    ForeignKey,
    Table,
    Enum,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid
import enum

# ---------------------------
# Association Tables
# ---------------------------

profile_community = Table(
    "profile_community",
    Base.metadata,
    Column(
        "profile_id", UUID(as_uuid=True), ForeignKey("profiles.id"), primary_key=True
    ),
    Column(
        "community_id",
        UUID(as_uuid=True),
        ForeignKey("communities.id"),
        primary_key=True,
    ),
    Column("role", String, default="member"),
)

profile_interest = Table(
    "profile_interest",
    Base.metadata,
    Column(
        "profile_id", UUID(as_uuid=True), ForeignKey("profiles.id"), primary_key=True
    ),
    Column(
        "interest_id", UUID(as_uuid=True), ForeignKey("interests.id"), primary_key=True
    ),
)

# ---------------------------
# Models
# ---------------------------


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    bio = Column(Text)
    address = Column(Text)
    profile_image_url = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    communities = relationship(
        "Community", secondary=profile_community, back_populates="members"
    )
    interests = relationship(
        "Interest", secondary=profile_interest, back_populates="profiles"
    )
    posts = relationship("Post", back_populates="author")
    items = relationship("Item", back_populates="owner")


class Community(Base):
    __tablename__ = "communities"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)
    lake_name = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    members = relationship(
        "Profile", secondary=profile_community, back_populates="communities"
    )
    posts = relationship("Post", back_populates="community")


class Interest(Base):
    __tablename__ = "interests"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    name = Column(String, nullable=False, unique=True)

    profiles = relationship(
        "Profile", secondary=profile_interest, back_populates="interests"
    )


class PostType(enum.Enum):
    EVENT = "event"
    ANNOUNCEMENT = "announcement"
    GENERAL = "general"


class Post(Base):
    __tablename__ = "posts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    post_type = Column(Enum(PostType), default=PostType.GENERAL)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    author_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    community_id = Column(
        UUID(as_uuid=True), ForeignKey("communities.id"), nullable=True
    )

    author = relationship("Profile", back_populates="posts")
    community = relationship("Community", back_populates="posts")


class ItemCategory(enum.Enum):
    BOAT = "boat"
    VEHICLE = "vehicle"
    WATER_TOY = "water_toy"
    EQUIPMENT = "equipment"
    OTHER = "other"


class Item(Base):
    __tablename__ = "items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    owner_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(Enum(ItemCategory), default=ItemCategory.OTHER)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    owner = relationship("Profile", back_populates="items")
