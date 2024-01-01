from strawberry.fastapi import BaseContext
from sqlmodel import Session
from fastapi import Depends
from app.core.container import Container
from app.database.init_database import get_db_session
from app.services.hero import HeroService
from app.services.skill import SkillService
from dependency_injector.wiring import inject, Provide


class CustomContext(BaseContext):
    def __init__(
        self,
        db_session: Session,
        hero_service: HeroService,
        skill_service: SkillService,
    ):
        self.db_session = db_session
        self.hero_service = hero_service
        self.skill_service = skill_service


@inject
async def get_context(
    db_session: Session = Depends(get_db_session),
    hero_service: HeroService = Depends(Provide[Container.hero_service]),
    skill_service: SkillService = Depends(Provide[Container.skill_service]),
) -> CustomContext:
    return CustomContext(
        db_session=db_session, hero_service=hero_service, skill_service=skill_service
    )
