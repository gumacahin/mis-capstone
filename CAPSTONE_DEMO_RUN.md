# Capstone Demo Run

Date: 2026-06-28

## Run Type

Automated Playwright walkthrough of the planner evaluation demo.

This run used Playwright API fixtures that mirror the seeded demo dataset. It
validated the visible `/today` planner flow in Chromium. It should be treated as
demo evidence, not participant evaluation evidence.

## Real-Backend Run Type

Automated Playwright walkthrough of the planner evaluation demo against the
local Django backend and Vite frontend.

This run used the seeded planner evaluation dataset, a test-only bearer token,
and the real `/api` routes through the Vite proxy. It validates browser UI,
backend authentication, database persistence, planner actions, and feedback
submission for the seeded demo user. It is still demo evidence, not participant
evaluation evidence.

## Command

Run from the `ui/` directory:

```text
CI=1 PLAYWRIGHT_PORT=3104 PORT=3104 PLAYWRIGHT_BASE_URL=http://localhost:3104 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/planner-evaluation-demo.spec.ts --project=chromium
```

## Result

```text
2 passed (6.8s)
```

The two Playwright tests were:

- setup authentication state
- run the capstone walkthrough flow

## Walkthrough Performed

The browser walkthrough verified that `/today` can support the capstone
evaluation protocol:

- rendered the low-energy planner mode
- showed a 90-minute seeded check-in
- showed three faculty/staff-oriented suggestions
- opened the reason panel for `Grade overdue reflection submissions`
- showed structured task signals, including due status, priority, effort,
  project, history, and planner score
- updated the check-in to 75 available minutes with walkthrough context
- accepted the first suggestion
- snoozed the second suggestion
- dismissed the third suggestion
- submitted helpfulness and confidence ratings of 4 out of 5
- saved a feedback note
- showed the `Feedback saved` state

## Screenshot

Playwright saved a successful run screenshot at:

```text
ui/test-results/e2e-planner-evaluation-dem-8a293-e-capstone-walkthrough-flow-chromium/planner-evaluation-demo.png
```

The `ui/test-results/` directory is ignored by Git, so this screenshot is a
local run artifact rather than a committed source artifact.

## Real-Backend Command

Run from the `ui/` directory:

```text
E2E_USER_EMAIL=planner-demo@example.test AUTH0_USERNAME=planner-demo@example.test E2E_BEARER_TOKEN=e2e-token VITE_E2E_ACCESS_TOKEN=e2e-token CI=1 PLAYWRIGHT_PORT=3106 PORT=3106 PLAYWRIGHT_BACKEND_PORT=8001 PLAYWRIGHT_BASE_URL=http://localhost:3106 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
```

## Real-Backend Result

```text
2 passed (9.6s)
```

The real-backend Playwright run verified:

- E2E authentication through a test-only bearer-token backend authenticator
- Django migration and seeded demo data setup before the browser run
- Vite proxying `/api` calls to the isolated Django port
- profile, notification, project, task, and planner API reads
- planner check-in update
- suggestion accept, snooze, and dismiss actions
- planner feedback submission

Playwright saved a successful real-backend screenshot at:

```text
ui/test-results/e2e-planner-evaluation-rea-b9d05-through-flow-against-Django-chromium/planner-evaluation-real-backend.png
```

The successful run exposed and fixed one integration issue: the notification
hook now accepts both plain arrays and DRF paginated responses.

## Demo Data Boundary

The fixture-backed run used fixture data inside
`ui/tests/e2e/planner-evaluation-demo.spec.ts`. The fixture mirrors the seeded
walkthrough scenario but does not prove backend authentication or database
persistence.

The real-backend run uses `playwright.real-backend.config.ts`, starts Django on
an isolated backend port, starts Vite on an isolated frontend port, and runs
`seed_planner_evaluation_demo --reset` before the browser test.

For local backend seed data, use:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset
```

For seeded sample admin metrics, use:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset --include-outcomes
```

## Notes

Two harness issues were found and corrected before the successful run:

- the Playwright profile fixture needed a default Inbox project because the app
  shell expects one
- the action selectors needed to target the second and third visible suggestion
  buttons instead of broad parent containers

The fixture-backed demo required no product code changes. The real-backend demo
required one small product integration fix for notification response shape and
test-only E2E authentication wiring that is disabled unless explicit local test
flags are set.
