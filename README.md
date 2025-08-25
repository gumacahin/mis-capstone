# "What should I do today?": UPOU Todo App

The todo app for the UPOU community.

Web application built with Django REST Framework and React.

## Getting Started

Install direnv:

```
...for diff os
direnv allow
```

Copy the example envrc:

```
cp example.envrc .envrc
```

Fill out the necessary info.

## Start the API

```bash
cd api
uv run python manage.py runserver
```

## Start the UI

```bash
cd ui
npm run dev
```

## E2E Testing

For end-to-end testing setup and usage, see:

- [E2E Testing Guide](docs/e2e-testing.md) - Comprehensive setup and usage
- [E2E Quick Reference](docs/e2e-quick-reference.md) - Essential commands and endpoints

### Quick Start E2E

```bash
# Start E2E environment
make e2e-up

# Check status
make e2e-status

# Stop E2E environment
make e2e-down
```
