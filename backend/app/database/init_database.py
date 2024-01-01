from sqlmodel import create_engine, Session
from app.core.config import settings
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

engine = create_engine(settings.POSTGRES_DB_URL)

@contextmanager
def get_db_session():
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            logger.exception("Session rollback because of exception")
            session.rollback()
            raise
        finally:
            session.close()
