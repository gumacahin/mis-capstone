

.PHONY: api
api:
	cd api; \
	poetry install; \
	poetry run python manage.py runserver; \

.PHONY: ui
ui:
	cd ui; \
	npm install; \
	npm run dev; \

.PHONY: shell
shell:
	cd api; \
	poetry run python manage.py shell; \

.PHONY: test
test:
	cd api; \
	poetry run pytest; \


