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

## 2026-06-28: JIT Planner Modes Rehearsal

### Purpose

Verify that the first visible just-in-time planner UI slice works and remains
demo-ready after adding mode-specific shortlists for low energy, limited time,
and overdue triage.

### Commands

Run from `ui/` with Node 22 active:

```text
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npx vitest run src/modules/planner/__tests__/uiSchema.test.ts
CI=1 PLAYWRIGHT_PORT=3102 PORT=3102 PLAYWRIGHT_BASE_URL=http://localhost:3102 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/today-page.spec.ts --project=chromium
CI=1 PLAYWRIGHT_PORT=3104 PORT=3104 PLAYWRIGHT_BASE_URL=http://localhost:3104 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/planner-evaluation-demo.spec.ts --project=chromium
E2E_USER_EMAIL=planner-demo@example.test AUTH0_USERNAME=planner-demo@example.test E2E_BEARER_TOKEN=e2e-token VITE_E2E_ACCESS_TOKEN=e2e-token CI=1 PLAYWRIGHT_PORT=3106 PORT=3106 PLAYWRIGHT_BACKEND_PORT=8001 PLAYWRIGHT_BASE_URL=http://localhost:3106 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run build
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run lint
```

### Result

```text
Planner UI schema tests: 8 passed
Today page e2e: 9 passed
Planner evaluation demo e2e: 2 passed
Real-backend planner demo: 2 passed (10.1s)
Frontend build: passed
Frontend lint: passed
```

### Verified Behavior

- Low-energy mode shows compact mode highlights and favors smaller next actions
  while preserving urgent work.
- Limited-time mode shows tasks that fit the available minutes, with a shortest
  next-action fallback.
- Overdue-triage mode narrows the visible shortlist to overdue suggestions.
- The planner demo still supports check-in, accept, snooze, dismiss, and
  feedback submission.
- The real-backend demo still passes against Django, Vite, database
  persistence, and typed planner endpoints.
- The real-backend run fetched `/api/schema/` without the older schema warning
  output.

### Rehearsal Interpretation

This is the first demo-ready evidence for controlled Gen UI in the product. The
planner adapts the visible surface from structured task and check-in data, while
state changes still go through typed backend operations.

It remains implementation/demo evidence. Participant evaluation must still be
reported separately.

## 2026-06-29: Planner Assistant Demo Rehearsal

### Purpose

Verify that the defense demo path still works after adding the `/today` planner
assistant panel that discovers and invokes typed planner tools.

This rehearsal specifically checks that the assistant panel remains a
deterministic typed-operation demo, not an unrestricted chat or raw database
interface.

### Commands

Run from `api/`:

```text
uv run ruff check upoutodo
DEBUG=True uv run pytest --no-cov
```

Run from `ui/` with Node 22 active:

```text
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run build
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run lint
CI=1 PLAYWRIGHT_PORT=3110 PORT=3110 PLAYWRIGHT_BASE_URL=http://localhost:3110 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/today-page.spec.ts --project=chromium
CI=1 PLAYWRIGHT_PORT=3104 PORT=3104 PLAYWRIGHT_BASE_URL=http://localhost:3104 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/planner-evaluation-demo.spec.ts --project=chromium
E2E_USER_EMAIL=planner-demo@example.test AUTH0_USERNAME=planner-demo@example.test E2E_BEARER_TOKEN=e2e-token VITE_E2E_ACCESS_TOKEN=e2e-token CI=1 PLAYWRIGHT_PORT=3106 PORT=3106 PLAYWRIGHT_BACKEND_PORT=8001 PLAYWRIGHT_BASE_URL=http://localhost:3106 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
```

### Result

```text
Backend ruff: passed
Backend tests: 255 passed, 2 warnings
Frontend build: passed
Frontend lint: passed
Today page e2e: 10 passed
Planner evaluation demo e2e: 2 passed
Real-backend planner demo: 2 passed
```

### Verified Behavior

- `/today` still loads the planner-first surface.
- The planner assistant discovers the typed tool catalog.
- The planner assistant invokes canned typed operations and shows the returned
  `tool` and `result_type`.
- Low-energy, limited-time, suggestion reason, suggestion action, empty-state,
  unavailable-state, feedback, and assistant flows pass in Playwright.
- The fixture-backed evaluation demo still exercises the walkthrough flow.
- The real-backend demo still passes against Django, Vite, database
  persistence, typed planner endpoints, and planner feedback submission.

### Observed Non-Blocking Issues

- The first backend verification attempt failed under the sandbox because `uv`
  could not read its cache under `~/.cache/uv`; rerunning with local cache
  access fixed the environment issue.
- Running multiple Playwright dev servers concurrently produced pre-content
  shell timeouts in the fixture-backed specs. Sequential reruns on isolated
  ports passed.
- The backend test suite reported two `drf_spectacular` deprecation warnings.
- The frontend build still reports the existing large bundle warning.

### Rehearsal Interpretation

This is the current demo-readiness baseline after adding the planner assistant
panel. The defense can now show the safe bridge from just-in-time planner UI to
typed assistant operations without claiming that full chat or Google Calendar
sync is complete.

It remains implementation/demo evidence. Participant walkthroughs or adviser
feedback should still be recorded separately from automated verification.

## 2026-06-29: Code/Product Readiness Pass

### Purpose

Verify whether the current implementation is close enough to freeze as the
capstone MVP before shifting attention to screenshots, walkthrough evidence,
and final paper polish.

This pass intentionally checked the implemented `/today` planner path rather
than adding new generic task-management features.

### Commands

Run from `api/`:

```text
DEBUG=True uv run ruff check .
DEBUG=True uv run pytest --no-cov
```

Run from `ui/` with Node 22 active:

```text
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run lint
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run build
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run test:run
CI=1 PLAYWRIGHT_PORT=3112 PORT=3112 PLAYWRIGHT_BASE_URL=http://localhost:3112 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/today-page.spec.ts --project=chromium
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run test:e2e:planner-demo
PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH npm run test:e2e:planner-real
```

### Result

```text
Backend ruff: passed
Backend tests: 255 passed, 2 warnings
Frontend lint: passed
Frontend build: passed with known large-bundle warning
Frontend unit tests: 53 files passed, 6 skipped; 183 tests passed, 34 skipped
Today page e2e: 10 passed
Planner evaluation demo e2e: 2 passed
Real-backend planner demo: 2 passed
```

### Verified Behavior

- `/today` still loads the planner-first surface.
- The mocked `/today` suite still covers planner loading, check-in, low-energy
  mode, limited-time mode, overdue triage, suggestion reasons, suggestion
  actions, unavailable/empty states, feedback, and assistant behavior.
- The fixture-backed evaluation demo still exercises the guided planner
  walkthrough.
- The real-backend demo still exercises Django, Vite, database persistence,
  typed planner endpoints, suggestion action state, and feedback submission.
- The real-backend run fetched `/api/schema/` successfully.

### Local Artifacts

The real-backend run produced a privacy-safe local screenshot artifact at:

```text
ui/test-results/e2e-planner-evaluation-rea-b9d05-through-flow-against-Django-chromium/planner-evaluation-real-backend.png
```

The `ui/test-results/` directory is ignored by Git, so the screenshot remains a
local run artifact unless it is intentionally copied into a paper appendix or
submission package later.

### Observed Non-Blocking Issues

- `uv run ruff check .` needed local cache access outside the sandbox because
  the sandbox blocked `~/.cache/uv`.
- Playwright needed local server access outside the sandbox because Vite and
  Django bind localhost ports.
- Backend tests still report two `drf_spectacular` deprecation warnings.
- Frontend unit tests still emit existing console warnings from Auth0 test
  stubs, expected error-path logging, React Router future flags, and an
  existing `act(...)` warning in time-option tests.
- Frontend build still reports the existing large-bundle warning.

### Rehearsal Interpretation

The implementation is code-freeze candidate for the current capstone MVP. The
planner-first product path is passing backend, frontend, mocked browser, and
real-backend browser checks.

This does not mean final submission is complete. Remaining work is evidence and
paper readiness: privacy-safe screenshot selection, adviser or pilot
walkthroughs if possible, final Results text, and final citation/style checks.

## 2026-06-29: Paper Screenshot Evidence Package

### Purpose

Create a committed, privacy-safe screenshot artifact for the paper and demo
package without changing product code.

### Command

A temporary Playwright screenshot spec was used with the real-backend config,
then deleted after the image was produced. The run used seeded demo data from
the planner evaluation fixture:

```text
E2E_USER_EMAIL=planner-demo@example.test AUTH0_USERNAME=planner-demo@example.test E2E_BEARER_TOKEN=e2e-token VITE_E2E_ACCESS_TOKEN=e2e-token CI=1 PLAYWRIGHT_PORT=3114 PORT=3114 PLAYWRIGHT_BACKEND_PORT=8003 PLAYWRIGHT_BASE_URL=http://localhost:3114 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test --config=playwright.real-backend.config.ts tests/e2e/paper-screenshot.spec.ts --project=chromium
```

### Result

```text
Paper screenshot Playwright capture: 2 passed
Screenshot size: 1440 x 1600
```

### Committed Artifact

```text
paper-assets/today-planner-dashboard.png
```

The screenshot shows seeded demo content only:

- demo user label
- demo project name
- demo task titles and descriptions
- planner check-in
- low-energy just-in-time planner mode
- suggestion reason details
- typed planner assistant panel
- feedback card
- normal task list below the planner surface

### Rehearsal Interpretation

This screenshot is suitable as paper/demo evidence for the implemented
planner-first UI. It is not participant evidence and should not be described as
showing a real user's task data.

## 2026-07-03: Frontend Test Noise-Reduction Verification

### Purpose

Reduce noisy unit-test console output and ensure targeted frontend tests remain
stable after cleanup.

### Commands

Run from `ui/`:

```text
npx vitest run src/modules/tasks/components/__tests__/AddCommentForm.test.tsx --reporter=verbose
npx vitest run src/modules/tasks/components/__tests__/AddTaskButton.test.tsx --reporter=verbose
npx vitest run src/modules/tasks/components/__tests__/AddTaskDialog.test.tsx --reporter=verbose
npx vitest run src/modules/tasks/components/__tests__/AddTaskForm.test.tsx --reporter=verbose
npm run test:run -- src/api/__tests__/client.test.ts src/modules/shared/components/__tests__/NaturalLanguageInput.test.tsx src/modules/tasks/components/__tests__/AddCommentForm.test.tsx src/modules/tasks/components/__tests__/AddTaskButton.test.tsx src/modules/tasks/components/__tests__/AddTaskDialog.test.tsx src/modules/tasks/components/__tests__/AddTaskForm.test.tsx
```

### Result

```text
Targeted frontend suite: 6 files passed; 22 tests passed, 4 skipped
```

### Verified Behavior

- Expected auth/token error-path logging is asserted explicitly in API client
  tests.
- React Router future-flag warning is filtered from global test output.
- Task form/button/dialog/comment tests run without the previous heavy
  mock/import instability.
- Focused test suite completes successfully without leaving active background
  test processes.
