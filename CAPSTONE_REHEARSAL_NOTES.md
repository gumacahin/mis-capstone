# Capstone Rehearsal Notes

## 2026-06-28: Real-Backend Planner Demo Rehearsal

### Purpose

Verify that the defense demo path still works against the real Django backend
and Vite frontend after the SRS traceability, argument, and demo-script
documentation work.

### Command

Run from `ui/` with Node 22 active:

```text
npm run test:e2e:planner-real
```

The default shell currently resolves Node 14.18.1, so the rehearsal used the
project's known Node 22 path:

```text
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run test:e2e:planner-real
```

### Result

```text
2 passed (11.5s)
```

The run verified the real-backend planner walkthrough:

- Django backend started on the isolated Playwright backend port.
- Vite frontend started on the isolated Playwright frontend port.
- The seeded planner demo user was reused through E2E auth state.
- `/today` loaded profile, notification, project, task, and planner API data.
- The planner check-in endpoint updated the plan.
- Suggestion accept, snooze, and dismiss endpoints updated plan item state.
- Planner feedback submission succeeded.

### Local Artifacts

Playwright recorded a passed run:

```text
ui/test-results/.last-run.json
```

Screenshot path:

```text
ui/test-results/e2e-planner-evaluation-rea-b9d05-through-flow-against-Django-chromium/planner-evaluation-real-backend.png
```

The `ui/test-results/` directory is ignored by Git, so screenshots remain local
run artifacts.

### Observed Non-Blocking Issues

- The first sandboxed run failed before tests started because `uv` could not
  access its cache under `/Users/marcoenrico/.cache/uv`. Rerunning the same
  command with elevated local access fixed the environment issue.
- The default shell resolved Node 14.18.1. The demo should use Node 18+,
  preferably the project's Node 22.11.0 from `ui/.nvmrc`.
- The backend still emits older OpenAPI schema warnings for serializer method
  field type hints, duplicate nested user serializers, and serializer guesses
  for admin/productivity/email API views. These did not block the planner demo.
- Django emitted an existing naive datetime warning for seeded task due dates.
  This did not block the planner demo.

### Rehearsal Interpretation

This is strong demo-readiness evidence for the capstone defense flow because it
exercises the browser UI, real backend routes, database persistence, typed
planner actions, and feedback submission.

It remains demo evidence, not participant evaluation evidence. Participant
evaluation still requires walkthrough notes or feedback from UPOU faculty/staff
or clearly labeled pilot participants.

## 2026-06-28: Post-Polish Real-Backend Planner Rehearsal

### Purpose

Verify that the capstone demo path still works after the planner feedback polish
and aggregate admin evaluation dashboard polish.

This specifically checks that the latest UI makes planner actions visible as
evaluation evidence while still exercising the real Django backend.

### Commands

Run from `ui/` with Node 22 active:

```text
E2E_USER_EMAIL=planner-demo@example.test AUTH0_USERNAME=planner-demo@example.test E2E_BEARER_TOKEN=e2e-token VITE_E2E_ACCESS_TOKEN=e2e-token CI=1 PLAYWRIGHT_PORT=3106 PORT=3106 PLAYWRIGHT_BACKEND_PORT=8001 PLAYWRIGHT_BASE_URL=http://localhost:3106 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
```

Targeted admin dashboard verification:

```text
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npx vitest run src/modules/admin/components/__tests__/AdminDashboard.test.tsx
```

### Result

```text
Real-backend planner demo: 2 passed (10.1s)
Admin dashboard test: 1 passed
```

### Verified Behavior

- `/today` loaded against the real backend for the seeded planner demo user.
- The planner check-in updated the current plan.
- Accept, snooze, and dismiss actions persisted through typed planner endpoints.
- The UI showed planner action confirmations suitable for evaluation evidence.
- Planner feedback submission succeeded.
- The aggregate admin Planner Evaluation panel still renders without exposing
  individual task titles or raw participant notes.

### Local Artifacts

Playwright recorded the passed real-backend screenshot at:

```text
ui/test-results/e2e-planner-evaluation-rea-b9d05-through-flow-against-Django-chromium/planner-evaluation-real-backend.png
```

The `ui/test-results/` directory is ignored by Git, so this remains a local run
artifact.

### Observed Non-Blocking Issues

- The backend still emits older OpenAPI schema warnings for serializer method
  field type hints, duplicate nested user serializers, and serializer guesses
  for admin/productivity/email API views.
- The shell emitted an existing RVM `ps` permission warning during the Vitest
  command. It did not affect the test result.
- The demo still requires Node 18+, preferably the project's Node 22.11.0 from
  `ui/.nvmrc`; the default shell may resolve an older Node version.

### Rehearsal Interpretation

This is current demo-readiness evidence for the planner-first capstone path
after the evaluation-facing UI polish. It validates the implementation path
from browser UI to Django persistence and aggregate evaluation reporting.

It remains implementation/demo evidence. The capstone paper should still label
participant walkthroughs, adviser review, or faculty/staff feedback separately
from automated Playwright evidence.
