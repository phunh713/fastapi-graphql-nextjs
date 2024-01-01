from enum import Enum
from typing import TYPE_CHECKING, Optional
from app.models.base import BaseModel, IdMixin
from sqlmodel import Field, Relationship, SQLModel, Enum as SqlEnum
import strawberry

if TYPE_CHECKING:
    from app.models.hero import Hero


@strawberry.enum
class HeroSkillType(Enum):
    active = "active"
    passive = "passive"


class Skill(BaseModel, IdMixin, table=True):
    name: str = Field(unique=True, index=True)
    type: HeroSkillType = Field(
        sa_type=SqlEnum(
            HeroSkillType,
            inherit_schema=True,
        )
    )
    description: Optional[str] = None
    mana_cost: int = Field(ge=0)
    cooldown: int = Field(ge=0)
    hero_id: Optional[int] = Field(default=None, foreign_key="hero.id")
    hero: "Hero" = Relationship(
        back_populates="skills", sa_relationship_kwargs={"lazy": "selectin"}
    )


class SkillCreate(SQLModel):
    name: str = Field(unique=True, index=True)
    type: HeroSkillType
    description: Optional[str] = None
    mana_cost: int = Field(ge=0)
    cooldown: int = Field(ge=0)
    hero_id: Optional[int] = None
