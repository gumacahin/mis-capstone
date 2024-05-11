.PHONY: api

api:
	cd tutorial; \
	source env/bin/activate; \
	poetry install; \
	poetry run python manage.py runserver; \

.PHONY: shell

shell:
	cd tutorial; \
	source env/bin/activate; \
	poetry install; \
	poetry run python manage.py shell; \
