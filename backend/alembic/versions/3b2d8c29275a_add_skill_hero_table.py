"""add skill, hero table

Revision ID: 3b2d8c29275a
Revises: 
Create Date: 2023-12-31 17:25:50.736549

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '3b2d8c29275a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('hero',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('avatar', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('attack_type', sa.Enum('range', 'melee', name='attacttype', schema='dota2', inherit_schema=True), nullable=False),
    sa.Column('attribute', sa.Enum('strength', 'magic', 'agility', name='attribute', schema='dota2', inherit_schema=True), nullable=False),
    sa.Column('base_movement', sa.Integer(), nullable=False),
    sa.Column('base_damage', sa.Integer(), nullable=False),
    sa.Column('base_health', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    schema='dota2'
    )
    op.create_index(op.f('ix_dota2_hero_name'), 'hero', ['name'], unique=True, schema='dota2')
    op.create_table('skill',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('type', sa.Enum('active', 'passive', name='skilltype', schema='dota2', inherit_schema=True), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('mana_cost', sa.Integer(), nullable=False),
    sa.Column('cooldown', sa.Integer(), nullable=False),
    sa.Column('hero_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['hero_id'], ['dota2.hero.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='dota2'
    )
    op.create_index(op.f('ix_dota2_skill_name'), 'skill', ['name'], unique=True, schema='dota2')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_dota2_skill_name'), table_name='skill', schema='dota2')
    op.drop_table('skill', schema='dota2')
    op.drop_index(op.f('ix_dota2_hero_name'), table_name='hero', schema='dota2')
    op.drop_table('hero', schema='dota2')
    # ### end Alembic commands ###
