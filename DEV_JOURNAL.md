# Development Journal

This journal records product decisions, implementation work, verification, and
Codex-assisted development observations for the capstone project. It is intended
to support the project paper as an audit trail of how the implementation evolved
from a generic todo backend into a planner-first productivity tracker.

## Journal Method

Each entry should capture:

- Date
- Goal or question for the session
- Human decisions and constraints
- Codex-assisted actions
- Verification performed
- Study notes or reflections

The journal should distinguish between:

- product decisions, such as changing the system direction
- implementation work, such as models, endpoints, UI, and tests
- research-method observations about working with Codex

Codex output should be treated as an assisted development artifact, not as
independent validation. Human review, tests, and alignment with the source paper
remain required.

## 2026-06-27: Direction Reset Toward Planning

### Goal

Clarify whether the project should continue expanding the Django REST todo
backend or refocus on the differentiator from Crisanto's paper: "What should I
do today?"

### Human Decisions And Constraints

- The original implementation had grown into a broad todo backend with projects,
  sections, tasks, tags, recurrence, notifications, email digest, admin
  dashboard, productivity page, generated API client, and tests.
- Prior guidance warned that this risked recreating Todoist or Trello.
- The project direction was reset to treat the current Django backend as a
  minimal system of record rather than as the main innovation.
- The differentiator is daily planning support: helping users decide what to do
  today based on task state, deadlines, energy, available time, and context.

### Codex-Assisted Actions

- Reviewed the product direction and proposed an "Option 1.5" architecture:
  Django/DRF owns state, permissions, validation, and audit-friendly operations;
  React becomes planner-first; future chat or MCP-style integrations call typed
  backend operations only.
- Clarified that Google Calendar can be a sync or scheduling destination, but
  should not be the primary todo database.
- Clarified that "typed operations" means predefined backend actions with
  structured inputs, not raw SQL, unrestricted ORM access, or free-form database
  mutation.

### Study Notes

- This shift strengthens the capstone narrative because the project is no
  longer framed as a generic task app.
- The core distinction is:

```text
Generic task app:
"What tasks do I have?"

Planner-first app:
"Given my tasks, deadlines, energy, and available time, what should I do today?"
```

## 2026-06-27: Source Paper Scope And Capstone Narrative

### Goal

Resolve whether the implementation and paper should target faculty, students, or
both.

### Human Decisions And Constraints

- The project proposal previously mentioned "faculty and students."
- The source paper by Crisanto studied UPOU employees, specifically faculty,
  research assistants, and staff.
- To stay aligned with the evidence base, the implementation should focus on
  UPOU faculty and staff as the primary validated scope.
- Student use cases can be described as adjacent or future work.

### Codex-Assisted Actions

- Drafted suggested wording for reframing the proposal without contradicting the
  original proposal.
- Added project notes explaining that faculty and staff are the primary current
  scope, while students are outside the primary validation scope for this
  version.
- Captured the capstone narrative as a planner-first productivity tracker
  grounded in the "What should I do today?" question.

### Study Notes

- The "wiggle" is to frame students as a future or adjacent user group rather
  than claiming they were part of the source study's validated requirements.
- This supports a defensible scope statement in the paper.

## 2026-06-27: Security And Privacy Freeze

### Goal

Address critical security and privacy issues before adding planner features.

### Human Decisions And Constraints

- The backend already contained broad task-management functionality.
- Before layering planning logic on top of task data, ownership and permission
  boundaries needed to be made safer.
- Admin and reporting behavior should align with the proposal's preference for
  aggregated or anonymized usage insights unless individual content exposure is
  explicitly justified.

### Codex-Assisted Actions

Implemented and committed:

```text
96d7616 Harden backend ownership and admin boundaries
```

Key fixes:

- Prevented profile self-escalation by allowlisting mutable profile fields and
  blocking client writes to protected fields such as `is_admin`.
- Scoped task foreign-key validation to the authenticated user's objects.
- Changed task bulk update to use the user-scoped queryset and reject missing or
  foreign task IDs before saving.
- Filtered and created comments only for tasks owned by the current user.
- Protected the daily digest endpoint so it requires admin access or a scheduler
  secret.
- Reduced admin UI exposure by removing generic raw task/user CRUD surfaces.
- Tightened production settings around debug mode, CORS defaults, default secret
  key behavior, and SQLite deployment.

### Verification

- Added focused backend tests for the security and privacy fixes.
- Ran backend linting and test suite later in the freeze process.

### Study Notes

- This step supports the typed-operations architecture because planner or chat
  interfaces should rely on backend-enforced permissions rather than trusting
  the client or an assistant.
- The Codex workflow was useful for identifying cross-cutting ownership issues,
  but the fixes required explicit test coverage to make the changes defensible.

## 2026-06-27: Planner Backend MVP

### Goal

Add the first planner-specific backend slice without expanding generic todo
features.

### Codex-Assisted Actions

Implemented and committed:

```text
0ca2e84 Add planner backend suggestions API
```

Added:

- `EnergyCheckIn`: daily energy level, available time, focus mode, and optional
  context.
- `TodayPlan`: generated plan for a user and date.
- `PlanItem`: ordered task suggestions with reason, estimated minutes, score,
  and accepted, snoozed, or dismissed state.
- Planner service logic for deterministic, explainable task scoring.
- Planner API endpoints:
  - `GET /api/planner/today/`
  - `POST /api/planner/check-in/`
  - `POST /api/planner/rebuild/`
  - `POST /api/planner/suggestions/{id}/accept/`
  - `POST /api/planner/suggestions/{id}/snooze/`
  - `POST /api/planner/suggestions/{id}/dismiss/`

### Verification

- Added endpoint tests for planner behavior.
- Confirmed the planner uses the existing task system as a source of record
  rather than replacing it.

### Study Notes

- This is the first concrete implementation of the "What should I do today?"
  differentiator.
- The planner API creates a typed operation surface that can later be reused by
  chat, widgets, or MCP-style tools.

## 2026-06-27: Planner-First Today UI

### Goal

Move the visible product experience toward planning by making `/today` the
planner dashboard.

### Codex-Assisted Actions

Implemented and committed:

```text
c8d199c Make Today page planner-first
```

Added to `/today`:

- Energy and available-time check-in.
- Focus mode and optional context entry.
- Suggested tasks with reasons and estimated minutes.
- Accept, snooze, and dismiss actions.
- The normal task list remains below the planner section.

### Study Notes

- This keeps the existing task system useful while visually and functionally
  shifting the product toward planning.
- The UI now starts with a planning question instead of a generic task list.

## 2026-06-27: E2E And Build Stabilization

### Goal

Add an end-to-end test that inspects `/today` and make the frontend build/test
environment reliable enough for planner work.

### Codex-Assisted Actions

Implemented and committed:

```text
8ef3234 Stabilize frontend E2E and build gates
```

Added or updated:

- Playwright configuration for configurable local ports and E2E auth bypass.
- E2E Auth0-like storage state setup.
- Auth wrapper behavior for E2E mode.
- API client default base URL behavior in browser contexts.
- Vite port configuration.
- Type/build fixes required by the current UI.
- Playwright `/today` spec that verifies:
  - Today page navigation.
  - Planner check-in controls.
  - Suggested task title, reason, and estimated minutes.
  - Check-in payload submission.
  - Suggestion acceptance behavior.

### Verification

The following checks passed during the freeze:

```text
api: uv run ruff check .
api: uv run pytest --no-cov
ui: npm run build
ui: targeted ESLint for changed frontend/config/E2E files
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed results:

```text
api: 221 passed, 7 known timezone warnings
ui E2E: 3 passed
```

### Study Notes

- The E2E test makes the planner-first direction observable at the product
  level, not only in backend unit tests.
- Codex helped wire the test environment, but this also exposed existing UI type
  and build debt.

## 2026-06-27: Freeze And Paper Notes

### Goal

Document the current project state so future work does not drift back into
generic todo-app expansion.

### Codex-Assisted Actions

Implemented and committed:

```text
6edac64 Document capstone planner freeze baseline
```

Added:

- `CAPSTONE_NOTES.md`: source scope, capstone narrative, and typed operations.
- `FREEZE_NOTES.md`: frozen direction, security/privacy baseline, planner MVP,
  verification, known debt, and recommended next work.

### Study Notes

- The freeze gives the project a stable baseline for the capstone paper.
- The implementation now has a clearer claim: Django is the system of record;
  the planner layer is the contribution; future assistant tools should operate
  through typed backend actions.

## 2026-06-27: Codex Collaboration As Study Artifact

### Goal

Record the use of Codex itself as part of the development process for the
capstone study.

### Human Decisions And Constraints

- The human developer remains responsible for product direction, source-paper
  alignment, acceptance of changes, and capstone claims.
- Codex is used as an implementation and analysis assistant, not as an
  autonomous evaluator of correctness.
- Outputs must be verified through tests, code review, and consistency with the
  source paper.

### Codex-Assisted Actions

- Helped interpret product direction from the study title and requirements
  framing.
- Identified security and privacy risks in the existing implementation.
- Implemented backend hardening, planner endpoints, planner UI, and E2E tests.
- Drafted capstone notes, freeze notes, and this development journal.

### Study Notes

Potential paper framing:

```text
The project also documents the use of an AI coding assistant as part of the
software development process. Codex was used to support code review,
implementation, test creation, and documentation. The developer retained
decision authority over scope, requirements interpretation, and acceptance of
changes. Generated changes were treated as development artifacts and validated
through automated tests and manual review.
```

This framing avoids claiming Codex as a research participant. It instead treats
Codex-assisted development as part of the engineering method and implementation
workflow.

## 2026-06-27: Typed Planner Frontend Client

### Goal

Make the frontend planner API contract explicit before adding more planner
behavior.

### Human Decisions And Constraints

- The `/today` page already worked, but planner types and mutations were mixed
  into the broad shared query module.
- Since typed operations are part of the capstone architecture, the frontend
  should expose planner operations as a clear module instead of spreading them
  through generic app hooks.
- The generated API client is still useful, but the planner API is new enough
  that a small dedicated typed client is the pragmatic next step.

### Codex-Assisted Actions

- Added `ui/src/modules/planner/types.ts` for planner check-ins, suggestions,
  actions, and today plans.
- Added `ui/src/modules/planner/client.ts` with typed planner operations:
  - `getTodayPlan`
  - `submitPlannerCheckIn`
  - `rebuildTodayPlan`
  - `updatePlannerSuggestion`
- Added `ui/src/modules/planner/hooks.ts` for React Query integration.
- Added an `@planner` path alias.
- Refactored `/today` to import planner behavior from `@planner`.
- Removed planner-specific types and hooks from
  `ui/src/modules/shared/hooks/queries.ts`.
- Updated `FREEZE_NOTES.md` so the typed planner client is no longer listed as
  unfinished work.

### Verification

```text
ui: targeted ESLint for planner, Today page, and shared query files
ui: npm run build
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed result:

```text
ui E2E: 3 passed
```

### Study Notes

- This change makes the typed-operations concept visible in frontend code, not
  only in backend routes and capstone notes.
- The planner client is a bridge toward future chat or MCP-style tools because
  it names the operations the UI can perform.
- The next API-contract improvement is to include planner endpoints in the
  generated OpenAPI client after the planner API stabilizes.

## 2026-06-28: Just-in-Time Planner UI Spec

### Goal

Explore generative UI and just-in-time UI as a product direction without
resuming implementation work.

### Human Decisions And Constraints

- Coding was intentionally paused to explore the product concept further.
- Key terms needed to be clarified before adding new design artifacts.
- The just-in-time UI direction must preserve the existing architecture:
  Django owns state and validation, React renders known components, and any
  assistant or chat layer calls typed operations only.

### Codex-Assisted Actions

- Clarified HCI as Human-Computer Interaction.
- Clarified "artifact" as a concrete capstone output that documents,
  demonstrates, or validates part of the work.
- Added `JIT_PLANNER_UI_SPEC.md` as a product/design artifact.
- Added key terms for generative UI, just-in-time UI, intent, component
  registry, UI schema, grounding, human-in-the-loop, and cognitive load.
- Defined core user situations for the planner:
  - the user does not know what to do today
  - the user has low energy
  - the user has limited time
  - the user has too many overdue tasks
  - the user asks why a task was suggested
- Defined a planner component catalog and mapped each component to typed
  backend operations.
- Added safety rules, evaluation criteria, MVP flow, implementation notes, and
  open questions.

### Study Notes

- This is a design artifact, not an implementation commit for product behavior.
- The strongest capstone framing is that generative UI should mean structured
  UI selection from a safe component registry, not runtime generation of raw
  frontend code.
- The just-in-time UI idea supports the planner-first narrative because it
  targets the decision moment: what should the user do next?

## 2026-06-28: Just-in-Time Planner UI Implementation

### Goal

Implement the first practical slice of the JIT planner UI spec without adding
chat, runtime-generated frontend code, or new generic task-management features.

### Human Decisions And Constraints

- The implementation should make the JIT architecture visible in code.
- The assistant should still operate only through safe, typed planner actions.
- Django remains the system of record.
- React should render only known planner components from a registry.

### Codex-Assisted Actions

- Added `buildPlannerUiSchema` in `ui/src/modules/planner/uiSchema.ts`.
- Added a planner component registry in `ui/src/modules/planner/registry.tsx`.
- Extracted the inline `/today` planner panel into named planner components:
  - `EnergyCheckInCard`
  - `PlanSuggestionsCard`
  - `PlannerSurface`
  - `PlannerUnavailableCard`
  - `SuggestionCard`
  - `SuggestionReasonCard`
  - `TaskSignalBreakdown`
- Refactored `/today` so it renders `PlannerSurface` instead of owning planner
  UI details directly.
- Added low-energy, limited-time, and overdue-triage schema modes.
- Added just-in-time reason details: the reason panel is mounted only after the
  user asks "Why this?"
- Expanded Playwright coverage for:
  - existing check-in and accept behavior
  - reason details and task signals
  - low-energy UI selection
  - snooze and dismiss actions
  - empty planner suggestions
  - planner unavailable state
- Updated `JIT_PLANNER_UI_SPEC.md` to mark the first registry-based slice as
  implemented.

### Verification

```text
ui: targeted ESLint for planner, Today page, and Today E2E spec
ui: npm run build
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed result:

```text
ui E2E: 8 passed
```

### Study Notes

- This turns the JIT UI idea from a design artifact into an implementation
  artifact.
- The implementation keeps the safer interpretation of generative UI: structured
  component selection and props, not arbitrary generated frontend code.
- The next research-facing improvement is to make task signals more structured
  so reason explanations can be evaluated more directly.

## 2026-06-28: Planner UI Schema Unit Tests

### Goal

Add fast, focused tests for the JIT planner UI decision logic instead of relying
only on Playwright coverage.

### Human Decisions And Constraints

- The schema selection rules are product logic, so they should be tested close
  to the module that owns them.
- E2E tests remain useful for user-visible behavior, but unit tests give clearer
  evidence for the component-selection rules.

### Codex-Assisted Actions

- Added `ui/src/modules/planner/__tests__/uiSchema.test.ts`.
- Covered default schema selection for `EnergyCheckInCard` and `TodayPlanCard`.
- Covered low-energy mode selection.
- Covered limited-time mode selection.
- Covered overdue triage selection and precedence over low-energy or
  limited-time modes.
- Covered planner unavailable state.
- Covered loading and empty states.
- Covered dismissed suggestion filtering in both `visiblePlannerSuggestions`
  and generated schema IDs.
- Updated `JIT_PLANNER_UI_SPEC.md` so schema unit tests are recorded as
  implemented.

### Verification

```text
ui: targeted ESLint for planner schema and schema tests
ui: vitest run src/modules/planner/__tests__/uiSchema.test.ts
```

Observed result:

```text
ui schema tests: 7 passed
```

### Study Notes

- These tests are a verification artifact for the JIT UI component registry.
- They help show that the UI adaptation is deterministic and reviewable rather
  than arbitrary model-generated interface behavior.

## 2026-06-28: Structured Planner Task Signals

### Goal

Make suggestion explanations more explicit by returning structured task signals
from the planner API instead of deriving every label in the frontend.

### Human Decisions And Constraints

- The signal payload should be read-only and derived from existing task and
  plan data.
- No schema migration should be needed for this first slice.
- The frontend reason view should display backend-provided evidence while still
  using the existing typed planner operations.

### Codex-Assisted Actions

- Added a `signals` object to `PlanItemSerializer` responses.
- Included due date, due status, due label, due offset, priority, priority
  label, estimated minutes, recurrence flag, project title, section title,
  rounded score, snoozed count, and dismissed count.
- Added backend planner endpoint coverage for the structured signal payload.
- Added `PlannerTaskSignals` and `PlannerDueStatus` frontend types.
- Updated `TaskSignalBreakdown` to render the API-provided signals.
- Updated Today E2E and planner schema unit-test fixtures to include signals.
- Updated `JIT_PLANNER_UI_SPEC.md` so structured task signals are recorded as
  implemented.

### Verification

```text
api: uv run ruff check .
api: uv run pytest --no-cov
ui: targeted ESLint for planner and Today E2E files
ui: vitest run src/modules/planner/__tests__/uiSchema.test.ts
ui: npm run build
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed results:

```text
api: 222 passed, 7 known timezone warnings
ui schema tests: 7 passed
ui E2E: 8 passed
```

### Study Notes

- This strengthens the capstone claim that suggestions are explainable and
  grounded in real application data.
- The reason view now has a clearer evidence model for future evaluation:
  users can inspect due status, priority, effort, recurrence, location, score,
  and prior snooze or dismiss history.

## 2026-06-28: Planner Feedback Capture

### Goal

Add a small evaluation slice so `/today` can capture whether the generated
daily plan was useful and whether it increased the user's confidence about what
to do next.

### Human Decisions And Constraints

- This should support the capstone study and HCI evaluation, not expand generic
  task-management scope.
- Feedback should belong to the current daily plan and authenticated user.
- The frontend should call a typed planner operation from the generated API
  client rather than posting to an ad hoc endpoint string.

### Codex-Assisted Actions

- Added `TodayPlanFeedback` with helpfulness rating, confidence rating,
  optional note, and one feedback record per `TodayPlan`.
- Added `POST /api/planner/feedback/`, which upserts feedback for the current
  authenticated user's current daily plan.
- Included nullable `feedback` in `GET /api/planner/today/`.
- Updated the OpenAPI planner contract test and regenerated the TypeScript
  client so `plannerFeedbackCreate` is available to the UI.
- Added `PlannerFeedbackCard` to `/today` with helpfulness, confidence, note,
  and saved-state behavior.
- Extended the Today Playwright spec to verify feedback submission through the
  typed planner endpoint.
- Updated `JIT_PLANNER_UI_SPEC.md` so `PlannerFeedbackCard` and
  `submit_plan_feedback` are part of the implemented component and operation
  catalog.

### Verification

```text
api: uv run ruff check targeted planner files
api: uv run ruff format --check targeted planner files
api: uv run pytest --no-cov upoutodo/tests/endpoints/test_planner.py
ui: targeted ESLint for planner and Today E2E files
ui: vitest run src/modules/planner/__tests__/uiSchema.test.ts
ui: npm run build
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed results:

```text
api planner tests: 11 passed
ui schema tests: 7 passed
ui E2E: 8 passed
ui build: passed
```

### Study Notes

- This creates a concrete user-evaluation artifact for the planner-first
  direction: helpfulness, confidence, and qualitative note.
- The feedback model can support later analysis of whether just-in-time planner
  UI improves the user's ability to decide what to do today.

## 2026-06-28: Planner OpenAPI Contract And Generated Client

### Goal

Move planner endpoints from an ad hoc frontend transport layer into the
generated OpenAPI contract so the typed-operations architecture is reflected in
the backend schema and frontend client.

### Human Decisions And Constraints

- The planner API is now stable enough to document in the schema.
- The frontend should call generated planner operations for `/today` behavior.
- Existing project/task hooks should keep working while the broader generated
  client migration continues.
- Admin-generated client support should not rely on stale generated files; the
  current UI does not use admin generated operations.

### Codex-Assisted Actions

- Exposed `GET /api/schema/` through DRF Spectacular.
- Added schema annotations for planner endpoints and the structured
  `PlanItemSignals` response object.
- Added a backend test that asserts planner paths, request bodies, responses,
  and signal fields appear in the OpenAPI schema.
- Regenerated the TypeScript OpenAPI client, adding generated planner API
  methods and planner models.
- Added a `planner` generated client to `useGeneratedApiClient`.
- Kept existing project/task hooks working through a small compatibility wrapper
  around the new split generated `ProjectsApi` and `TasksApi`.
- Refactored the planner frontend client to call generated planner methods
  instead of raw Axios paths.

### Verification

```text
api: uv run ruff check api/urls.py upoutodo/serializers/planner.py upoutodo/views/planner.py upoutodo/tests/endpoints/test_planner.py
api: uv run pytest --no-cov upoutodo/tests/endpoints/test_planner.py
ui: vitest run src/api/__tests__/client.test.ts src/api/__tests__/integration.test.ts src/api/__tests__/backward-compatibility.test.ts src/modules/planner/__tests__/uiSchema.test.ts
ui: npm run build
repo: git diff --check
```

Observed results:

```text
api planner tests: 9 passed
ui focused tests: 37 passed
ui build: passed
```

### Study Notes

- This makes the "typed" architecture more concrete: planner actions are now
  documented operations with generated client methods, not manually assembled
  URLs.
- The generated client exposed a separate debt item: admin routes are not part
  of the current generated schema surface used by the UI. That should be handled
  as a separate admin/reporting contract decision, not mixed into planner work.

## 2026-06-28: Planner Explanation Polish

### Goal

Improve `/today` suggestion explanations so users can understand why a task is
recommended without reading a raw score or scanning unlabeled chips.

### Human Decisions And Constraints

- This should stay deterministic and grounded in existing planner signals.
- No new LLM, chat, Google Calendar, or generic task-management behavior should
  be added in this slice.
- The UI should keep the just-in-time pattern: detailed reasoning appears when
  the user asks "Why this?"

### Codex-Assisted Actions

- Added `ui/src/modules/planner/explanations.ts` for pure explanation helpers.
- Replaced the inline suggestion sentence with a concise today line:
  due status, priority, effort, and project/section.
- Split expanded reasoning into:
  - "Why this matters today"
  - "Planner rationale"
  - labeled task signals
- Changed task signals from unlabeled chips into a compact evidence grid with
  due, priority, effort, project, recurrence, history, and planner score.
- Added unit tests for explanation helpers.
- Updated Today E2E coverage for the new summary line and labeled evidence.

### Verification

```text
ui: vitest run src/modules/planner/__tests__/explanations.test.ts src/modules/planner/__tests__/uiSchema.test.ts
ui: npm run build
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Observed results:

```text
ui explanation/schema tests: 11 passed
ui build: passed
ui E2E: 8 passed
```

### Study Notes

- This strengthens the HCI side of the capstone by making the recommendation
  explanation easier to inspect and evaluate.
- The explanation UI remains grounded in backend-provided typed signals rather
  than generated free-form reasoning.

## Running Notes For Future Sessions

- Keep generic todo features frozen unless they directly support planning.
- Prioritize planner-specific work on `/today`.
- Keep planner OpenAPI schema tests and generated client output current as
  endpoint behavior changes.
- Resolve admin/reporting schema coverage separately if admin UI generated
  operations become necessary again.
- Add Google Calendar sync only after planner operations stabilize.
- Continue recording major Codex-assisted decisions, patches, tests, and
  verification outcomes in this file.
