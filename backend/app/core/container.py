import logging

from dependency_injector import containers, providers

from app.database.init_database import get_db_session
from app.repositories.hero import HeroRepository
from app.repositories.skill import SkillRepository
from app.services.hero import HeroService
from app.services.skill import SkillService


# Please import Container class directly from this file if you want to use it in another file.
# Don't import it from __init__.py in the "core" folder.
# This is for the pytest to run.
class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=["app.routers.hero", "app.graphql.context"]
    )

    logger = providers.Singleton(logging.getLogger, name="uvicorn")

    hero_repository = providers.Singleton(HeroRepository, get_session=get_db_session)
    hero_service = providers.Singleton(HeroService, hero_repository=hero_repository)

    skill_repository = providers.Singleton(SkillRepository, get_session=get_db_session)
    skill_service = providers.Singleton(SkillService, skill_repository=skill_repository)
