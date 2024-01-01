from typing import Any, List, Optional

from strawberry import type, field, ID
from strawberry.types import Info

from app.graphql.context import CustomContext
from app.graphql.types import HeroType, SkillType

from typing import List


@type
class HeroQuery:
    @field
    def heroes(self, info: Info[CustomContext, Any]) -> List[HeroType]:
        hero_service = info.context.hero_service
        heroes = hero_service.get_all()
        return [HeroType.from_pydantic(hero) for hero in heroes]

    @field
    def hero(self, id: ID, info: Info[CustomContext, Any]) -> Optional[HeroType]:
        hero_service = info.context.hero_service
        hero = hero_service.get_by_id(int(id))
        return HeroType.from_pydantic(hero) if hero else None


@type
class SkillQuery:
    @field
    def skills(self, info: Info[CustomContext, Any]) -> List[SkillType]:
        skill_service = info.context.skill_service
        skills = skill_service.get_all()
        return [SkillType.from_pydantic(skill) for skill in skills]

    @field
    def skill(self, id: ID, info: Info[CustomContext, Any]) -> Optional[SkillType]:
        skill_service = info.context.skill_service
        skill = skill_service.get_by_id(int(id))
        return SkillType.from_pydantic(skill) if skill else None


@type
class RootQuery(HeroQuery, SkillQuery):
    pass
