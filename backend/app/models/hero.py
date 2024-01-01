from enum import Enum
from typing import List, Optional, TYPE_CHECKING
from app.models.base import BaseModel, IdMixin
from sqlmodel import Field, Relationship, SQLModel, Enum as SqlEnum
import strawberry

if TYPE_CHECKING:
    from app.models.skill import Skill


@strawberry.enum
class AttactType(Enum):
    range = "range"
    melee = "melee"


@strawberry.enum
class Attribute(Enum):
    strength = "strength"
    magic = "magic"
    agility = "agility"


class Hero(BaseModel, IdMixin, table=True):
    name: str = Field(unique=True, index=True)
    avatar: Optional[str] = None
    attack_type: AttactType = Field(
        sa_type=SqlEnum(
            AttactType,
            inherit_schema=True,
        )
    )
    attribute: Attribute = Field(
        sa_type=SqlEnum(
            Attribute,
            inherit_schema=True,
        )
    )
    base_movement: int = Field(gt=0)
    base_damage: int = Field(gt=0)
    base_health: int = Field(gt=0)
    skills: Optional[List["Skill"]] = Relationship(
        back_populates="hero", sa_relationship_kwargs={"lazy": "selectin"}
    )


class HeroCreate(SQLModel):
    name: str
    avatar: Optional[str] = None
    attack_type: AttactType
    attribute: Attribute
    base_movement: int
    base_damage: int = Field(gt=0)
    base_health: int
