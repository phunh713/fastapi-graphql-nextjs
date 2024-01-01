from typing import Optional
from sqlmodel import Field, SQLModel, MetaData
from pydantic import validator, root_validator
from app.core.config import settings


class BaseModel(SQLModel):
    metadata = MetaData(schema=settings.POSTGRES_SCHEMA)


class IdMixin(SQLModel):
    id: int = Field(primary_key=True)

    # when create, no id is provided => let id is 0 to bypass type validation
    @root_validator(pre=True)
    def validate1(cls, values):
        if values.model_dump().get("id") is None:
            return {**values.model_dump(), "id": 0}
        return values

    # then turn id back to None for DB to auto-generate ID
    @validator("id", pre=False)
    def check_id1(cls, value):
        if value == 0:
            return None
        return value
