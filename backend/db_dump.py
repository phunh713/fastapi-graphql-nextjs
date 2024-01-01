from sqlmodel import create_engine, Session, text
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

engine = create_engine(settings.POSTGRES_DB_URL)


def main():
    with Session(engine) as session:
        try:
            with open("./heroes.sql") as file:
                query = text(file.read())
                session.execute(query)
                session.commit()

            with open("./skills.sql") as file:
                query = text(file.read())
                session.execute(query)
                session.commit()

        except Exception as e:
            print(e)
        finally:
            session.close()


if __name__ == "__main__":
    main()
