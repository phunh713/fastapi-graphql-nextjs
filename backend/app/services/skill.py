from app.repositories.skill import SkillRepository
from app.models.skill import SkillCreate


class SkillService:
    def __init__(self, skill_repository: SkillRepository) -> None:
        self.skill_repository = skill_repository

    def get_all(self):
        return self.skill_repository.get_all()

    def get_by_id(self, id: int):
        return self.skill_repository.get_by_id(id)

    def add(self, hero: SkillCreate):
        return self.skill_repository.add(hero)
