.PHONY: api

api:
	python3 -m venv env; \
	source env/bin/activate; \
	cd api; \
	poetry install; \
	poetry run python manage.py runserver; \

.PHONY: shell

shell:
	python3 -m venv env; \
	source env/bin/activate; \
	cd api; \
	poetry install; \
	poetry run python manage.py shell; \


.PHONY: ui

ui:
	npm install --workspace=ui; \
	npm run dev --workspace=ui; \
