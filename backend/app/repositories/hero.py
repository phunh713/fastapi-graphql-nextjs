from typing import Callable

from sqlmodel import Session, select

from app.models.hero import Hero, HeroCreate


class HeroRepository:
    def __init__(self, get_session: Callable[[], Session]) -> None:
        self.get_session = get_session

    def get_all(self):
        with self.get_session() as session:
            return session.exec(select(Hero)).all()

    def get_by_id(self, id: int):
        with self.get_session() as session:
            return session.get(Hero, id)

    def add(self, hero: HeroCreate):
        with self.get_session() as session:
            db_hero = Hero.model_validate(hero)
            session.add(db_hero)
            session.commit()
            session.refresh(db_hero)
            return db_hero
