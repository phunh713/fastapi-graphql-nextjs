from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from app.graphql.context import get_context
from app.graphql.mutation import RootMutation
from app.graphql.query import RootQuery

from app.routers import hero
from app.core.config import settings
from app.core.container import Container
import strawberry
from strawberry.fastapi import GraphQLRouter


class ExtendedFastAPI(FastAPI):
    def __init__(self, container: Container, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.container = container


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


container = Container()

app = ExtendedFastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    container=container,
)

graphql_schema = strawberry.Schema(query=RootQuery, mutation=RootMutation)
graphql_app = GraphQLRouter(schema=graphql_schema, context_getter=get_context, debug=True)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router=hero.router, prefix=settings.API_V1_STR)
app.include_router(router=graphql_app, prefix="/graphql", tags=["GraphQL"])
