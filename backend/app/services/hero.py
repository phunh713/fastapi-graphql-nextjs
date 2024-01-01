from app.repositories.hero import HeroRepository
from app.models.hero import HeroCreate


class HeroService:
    def __init__(self, hero_repository: HeroRepository) -> None:
        self.hero_repository = hero_repository

    def get_all(self):
        return self.hero_repository.get_all()

    def get_by_id(self, id: int):
        return self.hero_repository.get_by_id(id)

    def add(self, hero: HeroCreate):
        return self.hero_repository.add(hero)
