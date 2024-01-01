from typing import List, Annotated
import strawberry

from app.models.hero import Hero, HeroCreate
from app.models.skill import Skill, SkillCreate


@strawberry.experimental.pydantic.input(HeroCreate, all_fields=True)
class HeroCreateInputType:
    pass


@strawberry.experimental.pydantic.type(Hero, all_fields=True)
class HeroType:
    skills: List[Annotated["SkillType", strawberry.lazy("app.graphql.types")]]


@strawberry.experimental.pydantic.input(SkillCreate, all_fields=True)
class SkillCreateInputType:
    pass


@strawberry.experimental.pydantic.type(Skill, all_fields=True)
class SkillType:
    hero: Annotated["HeroType", strawberry.lazy("app.graphql.types")]
