.PHONY: api shell ui

VENV_DIR := env
API_DIR := api
UI_DIR := ui

define SETUP_ENV
    python3 -m venv $(VENV_DIR); \
    source $(VENV_DIR)/bin/activate; \
    pip install -U pip setuptools; \
    pip install poetry
endef

api:
	$(SETUP_ENV); \
	poetry -C $(API_DIR) install; \
	poetry -C $(API_DIR) run python $(API_DIR)/manage.py runserver; \

shell:
	$(SETUP_ENV); \
	poetry -C $(API_DIR) run python $(API_DIR)/manage.py shell; \


ui:
	npm install --prefix $(UI_DIR); \
	npm run dev --prefix $(UI_DIR); \
