source ./venv/Scripts/activate

python ./db_prestart.py

alembic upgrade head

python ./db_dump.py

uvicorn app.main:app --reload