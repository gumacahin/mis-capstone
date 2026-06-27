# Capstone Demo Run

Date: 2026-06-28

## Run Type

Automated Playwright walkthrough of the planner evaluation demo.

This run used Playwright API fixtures that mirror the seeded demo dataset. It
validated the visible `/today` planner flow in Chromium. It should be treated as
demo evidence, not participant evaluation evidence.

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

## Demo Data Boundary

This run used fixture data inside
`ui/tests/e2e/planner-evaluation-demo.spec.ts`. The fixture mirrors the seeded
walkthrough scenario but does not prove backend authentication or database
persistence.

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

No product code changes were required for the successful demo run.
