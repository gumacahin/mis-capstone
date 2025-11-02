

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

.PHONY: test\:api
test\:api:
	cd api; \
	uv run pytest; \

.PHONY: test\:ui
test\:ui:
	cd ui; \
	npm run test:run; \

.PHONY: test\:e2e
test\:e2e:
	cd ui; \
	npm run test:e2e $(if $(ARGS),-- $(ARGS),);

.PHONY: test
test:
	make test:api; \
	make test:ui; \
	make test:e2e; \


.PHONY: resetdb
resetdb:
	cd api; \
	rm -rf db.sqlite3; \
	rm -rf api/upoutodo/migrations/; \
	uv run python manage.py makemigrations upoutodo; \
	uv run python manage.py migrate; \
