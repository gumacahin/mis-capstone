

.PHONY: api
api:
	cd api; \
	uv sync --all-groups; \
	uv run python manage.py runserver; \

.PHONY: ui
ui:
	cd ui; \
	npm install; \
	npm run dev; \

.PHONY: shell
shell:
	cd api; \
	uv run python manage.py shell; \

.PHONY: test
test:
	cd api; \
	uv run pytest; \

.PHONY: resetdb
resetdb:
	cd api; \
	rm -rf db.sqlite3; \
	rm -rf api/upoutodo/migrations/; \
	uv run python manage.py makemigrations upoutodo; \
	uv run python manage.py migrate; \


