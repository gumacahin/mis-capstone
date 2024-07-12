.PHONY: api

api:
	python3 -m venv env; \
	source env/bin/activate; \
	cd api; \
	poetry install; \
	poetry run python manage.py runserver; \

.PHONY: shell

shell:
	cd tutorial; \
	source env/bin/activate; \
	poetry install; \
	poetry run python manage.py shell; \


.PHONY: ui

ui:
	cd ui; \
	npm install; \
	npm run dev; \
