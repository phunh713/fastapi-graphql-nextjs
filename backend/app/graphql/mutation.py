from typing import Any, List
from strawberry import type, field
from strawberry.types import Info
from app.graphql.context import CustomContext


from app.graphql.types import (
    HeroCreateInputType,
    HeroType,
    SkillCreateInputType,
    SkillType,
)


@type
class HeroMutation:
    @field
    def add_hero(
        self, input: HeroCreateInputType, info: Info[CustomContext, Any]
    ) -> HeroType:
        hero_service = info.context.hero_service
        db_hero = hero_service.add(input.to_pydantic())
        return HeroType.from_pydantic(db_hero)

    @field
    def add_heroes(
        self, input: List[HeroCreateInputType], info: Info[CustomContext, Any]
    ) -> List[HeroType]:
        hero_service = info.context.hero_service

        return [
            HeroType.from_pydantic(db_hero)
            for db_hero in (hero_service.add(data.to_pydantic()) for data in input)
        ]


@type
class SkillMutation:
    @field
    def add_skill(
        self, input: SkillCreateInputType, info: Info[CustomContext, Any]
    ) -> SkillType:
        skill_service = info.context.skill_service
        db_skill = skill_service.add(input.to_pydantic())
        return SkillType.from_pydantic(db_skill)

    @field
    def add_skills(
        self, input: List[SkillCreateInputType], info: Info[CustomContext, Any]
    ) -> List[SkillType]:
        skill_service = info.context.skill_service

        return [
            SkillType.from_pydantic(db_skill)
            for db_skill in (skill_service.add(data.to_pydantic()) for data in input)
        ]


@type
class RootMutation(HeroMutation, SkillMutation):
    pass
