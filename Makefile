

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

# =========================
# E2E Test Environment
# =========================

.PHONY: e2e-up
e2e-up:
	@echo "Starting E2E test environment..."
	@mkdir -p tmp
	@touch .e2e
	@echo "Created .e2e sentinel file - test mode enabled"
	@echo "Starting backend with test settings..."
	@cd api && DJANGO_SETTINGS_MODULE=api.settings_test DJANGO_ALLOW_TEST_ENDPOINTS=1 uv run python manage.py migrate > ../tmp/backend.log 2>&1
	@cd api && DJANGO_SETTINGS_MODULE=api.settings_test DJANGO_ALLOW_TEST_ENDPOINTS=1 uv run python manage.py runserver 8000 >> ../tmp/backend.log 2>&1 & echo $$! > tmp/backend.pid
	@echo "Backend started (PID: $$(cat tmp/backend.pid))"
	@echo "Waiting for backend health check..."
	@for i in {1..120}; do \
		if curl -s http://localhost:8000/test/health > /dev/null 2>&1; then \
			echo "Backend ready!"; \
			break; \
		fi; \
		if [ $$i -eq 120 ]; then \
			echo "Backend failed to start within 60 seconds"; \
			exit 1; \
		fi; \
		echo -n "."; \
		sleep 0.5; \
	done
	@echo "Starting frontend..."
	@cd ui && \
	npm run dev -- --port 3000 --strictPort > ../tmp/frontend.log 2>&1 & \
	echo $$! > tmp/frontend.pid
	@echo "Frontend started (PID: $$(cat tmp/frontend.pid))"
	@echo "Waiting for frontend..."
	@for i in {1..120}; do \
		if curl -s http://localhost:3000 > /dev/null 2>&1; then \
			echo "Frontend ready!"; \
			break; \
		fi; \
		if [ $$i -eq 120 ]; then \
			echo "Frontend failed to start within 60 seconds"; \
			exit 1; \
		fi; \
		echo -n "."; \
		sleep 0.5; \
	done
	@echo ""
	@echo "E2E environment ready!"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend logs: tmp/backend.log"
	@echo "Frontend logs: tmp/frontend.log"

.PHONY: e2e-down
e2e-down:
	@echo "Stopping E2E test environment..."
	@if [ -f tmp/backend.pid ]; then \
		echo "Stopping backend (PID: $$(cat tmp/backend.pid))"; \
		kill $$(cat tmp/backend.pid) 2>/dev/null || true; \
		rm -f tmp/backend.pid; \
	fi
	@if [ -f tmp/frontend.pid ]; then \
		echo "Stopping frontend (PID: $$(cat tmp/frontend.pid))"; \
		kill $$(cat tmp/frontend.pid) 2>/dev/null || true; \
		rm -f tmp/frontend.pid; \
	fi
	@rm -f .e2e
	@echo "Removed .e2e sentinel file - test mode disabled"
	@echo "E2E environment stopped"

.PHONY: e2e-reset
e2e-reset:
	@echo "Resetting E2E database..."
	@curl -s -X POST http://localhost:8000/test/reset \
		-H "Content-Type: application/json" \
		-d '{"scenario": "baseline_empty_user"}' > /dev/null
	@echo "E2E database reset complete"

.PHONY: e2e-seed
e2e-seed:
	@echo "Seeding E2E database with scenario: $(scenario)"
	@curl -s -X POST http://localhost:8000/test/seed \
		-H "Content-Type: application/json" \
		-d '{"scenario": "$(scenario)"}' > /dev/null
	@echo "E2E database seeded"

.PHONY: e2e-status
e2e-status:
	@echo "E2E Environment Status:"
	@if [ -f .e2e ]; then \
		echo "  Test mode: ENABLED (.e2e exists)"; \
	else \
		echo "  Test mode: DISABLED"; \
	fi
	@if [ -f tmp/backend.pid ]; then \
		echo "  Backend: RUNNING (PID: $$(cat tmp/backend.pid))"; \
		curl -s http://localhost:8000/test/health 2>/dev/null | jq . 2>/dev/null || echo "    Health check failed"; \
	else \
		echo "  Backend: STOPPED"; \
	fi
	@if [ -f tmp/frontend.pid ]; then \
		echo "  Frontend: RUNNING (PID: $$(cat tmp/frontend.pid))"; \
	else \
		echo "  Frontend: STOPPED"; \
	fi

.PHONY: e2e-logs
e2e-logs:
	@echo "Backend logs (tmp/backend.log):"
	@echo "================================"
	@tail -20 tmp/backend.log 2>/dev/null || echo "No backend logs found"
	@echo ""
	@echo "Frontend logs (tmp/frontend.log):"
	@echo "================================="
	@tail -20 tmp/frontend.log 2>/dev/null || echo "No frontend logs found"

