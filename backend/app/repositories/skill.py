from typing import Callable

from sqlmodel import Session, select

from app.models.skill import Skill, SkillCreate


class SkillRepository:
    def __init__(self, get_session: Callable[[], Session]) -> None:
        self.get_session = get_session

    def get_all(self):
        with self.get_session() as session:
            return session.exec(select(Skill)).all()

    def get_by_id(self, id: int):
        with self.get_session() as session:
            return session.get(Skill, id)

    def add(self, hero: SkillCreate):
        with self.get_session() as session:
            db_skill = Skill.model_validate(hero)
            session.add(db_skill)
            session.commit()
            session.refresh(db_skill)
            return db_skill
