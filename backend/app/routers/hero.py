from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide

from app.core.container import Container
from app.models.hero import HeroCreate
from app.services.hero import HeroService

router = APIRouter(prefix="/heroes", tags=["Heroes"])


@router.get("")
@inject
def get_heroes(hero_service: HeroService = Depends(Provide[Container.hero_service])):
    return hero_service.get_all()


@router.post("")
@inject
def add_hero(
    hero: HeroCreate,
    hero_service: HeroService = Depends(Provide[Container.hero_service]),
):
    return hero_service.add(hero)
