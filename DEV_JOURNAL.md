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
api: uv run pytest --no-cov upoutodo/tests/endpoints/test_planner.py upoutodo/tests/endpoints/test_admin.py
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

## 2026-06-28: Anonymized Planner Evaluation Summary

### Goal

Turn captured planner feedback into aggregate evidence that can support the
capstone paper without exposing individual task content, user identities, or
free-form feedback notes.

### Human Decisions And Constraints

- Reporting should remain aggregate/anonymized unless individual content access
  is explicitly justified later.
- The endpoint should be admin-only because it summarizes cross-user planner
  behavior.
- The summary should stay planner-specific and avoid restarting generic admin
  task browsing.

### Codex-Assisted Actions

- Added `get_planner_evaluation_summary()` to the planner service.
- Added `PlannerEvaluationSummarySerializer` and nested summary serializers for
  suggestion status counts and action rates.
- Added `GET /api/planner/evaluation/` as an admin-only typed planner
  operation.
- The endpoint returns:
  - total plan count
  - feedback count
  - feedback response rate
  - average helpfulness rating
  - average confidence rating
  - total suggestion count
  - suggestion status counts
  - accepted, snoozed, and dismissed rates
- Added tests for admin-only access, empty datasets, aggregate metric values,
  and privacy boundaries.
- Updated the OpenAPI contract test and regenerated the TypeScript client,
  adding `plannerEvaluationRetrieve`.
- Updated `JIT_PLANNER_UI_SPEC.md` so aggregate evaluation reporting is part of
  the typed operation map and safety rules.

### Verification

```text
api: uv run ruff check targeted planner files
api: uv run ruff format --check targeted planner files
api: uv run pytest --no-cov upoutodo/tests/endpoints/test_planner.py
ui: npm run build
```

Observed results:

```text
api planner/admin endpoint tests: 19 passed
ui build: passed
```

### Study Notes

- This makes the feedback capture useful for the paper: raw qualitative notes
  remain private, while aggregate helpfulness/confidence and action rates can be
  discussed as evaluation data.
- The endpoint supports the capstone narrative that the app is planner-first:
  it measures whether users interact with and trust the generated daily plan,
  not how many generic task-management records exist.

## 2026-06-28: Planner Evaluation Admin Dashboard

### Goal

Make the anonymized planner evaluation summary visible in the application so it
can support capstone demos and paper discussion without exposing private task or
feedback content.

### Human Decisions And Constraints

- The UI should stay aggregate-only and avoid task titles, feedback notes,
  usernames, or emails.
- The dashboard should consume the typed planner operation exposed by the
  generated client.
- This should be a compact reporting slice, not a restart of broad admin CRUD.

### Codex-Assisted Actions

- Added `PlannerEvaluationSummary` frontend types.
- Added `getPlannerEvaluationSummary()` and `usePlannerEvaluationSummary()` to
  the planner module.
- Added a `Planner Evaluation` section to the admin dashboard showing:
  - plans generated
  - feedback response rate
  - average helpfulness
  - average confidence
  - accepted, snoozed, and dismissed suggestion rates
- Added a focused admin dashboard component test that mocks the dashboard and
  planner evaluation hooks and asserts aggregate metrics render.
- Added explicit Vitest aliases for planner/shared module paths so the focused
  test can resolve the same aliases used by the app.

### Verification

```text
ui: vitest run src/modules/admin/components/__tests__/AdminDashboard.test.tsx
ui: targeted ESLint for planner/admin dashboard files and vitest.config.ts
ui: npm run build
```

Observed results:

```text
admin dashboard test: 1 passed
ui build: passed
```

### Study Notes

- This makes the evaluation loop demonstrable: users provide planner feedback
  on `/today`, and admins can inspect anonymized aggregate outcomes.
- The dashboard can be used as a paper artifact showing how the system supports
  HCI-oriented evaluation without requiring access to individual task content.

## 2026-06-28: Capstone Evaluation Method Draft

### Goal

Turn the implemented planner feedback and aggregate dashboard work into a
paper-facing evaluation method.

### Human Decisions And Constraints

- The method should stay aligned with Crisanto's source-study scope: UPOU
  faculty and staff are the primary validation group.
- Student use cases should remain adjacent or future work unless a separate
  student evaluation is added.
- The evaluation should measure planner decision support, not generic todo-app
  completeness.
- Reporting should remain aggregate and privacy-preserving.
- Codex-assisted development should be documented as part of the engineering
  process, not treated as user validation.

### Codex-Assisted Actions

- Added `CAPSTONE_EVALUATION_METHOD.md`.
- Defined evaluation questions for `/today`, suggestion explanations,
  check-in fit, planner actions, and privacy-preserving reporting.
- Drafted participant scope, procedure, in-app measures, qualitative prompts,
  data-handling rules, success criteria, limitations, and a paper-ready method
  paragraph.
- Linked the evaluation method from `CAPSTONE_NOTES.md`.
- Updated `JIT_PLANNER_UI_SPEC.md` so the paper-facing evaluation method is no
  longer listed as pending implementation work.

### Verification

```text
repo: git diff --check
repo: git diff --cached --check
```

### Study Notes

- This closes the loop between implementation and the paper: `/today` now has
  feedback capture, aggregate evaluation reporting, and a written method for how
  those artifacts support the capstone.
- The method intentionally avoids overclaiming. It evaluates whether the
  planner helps users decide what to do today, not whether the app replaces all
  existing planning tools.

## 2026-06-28: Planner Evaluation Demo Seed

### Goal

Make the evaluation method easier to run by adding a repeatable local demo
dataset for `/today` walkthroughs, screenshots, and pilot testing.

### Human Decisions And Constraints

- The seed should support the capstone evaluation method without adding generic
  todo-product scope.
- The data should use faculty/staff-oriented planning examples aligned with the
  source-study scope.
- Sample outcomes should be optional so a clean walkthrough can be run without
  pre-filled feedback.
- The command should be repeatable and scoped to a clearly named demo user and
  project.

### Codex-Assisted Actions

- Added the `seed_planner_evaluation_demo` Django management command.
- The command creates or updates a `planner-demo` user, marks the profile as
  faculty/onboarded, creates a `Capstone Evaluation Demo` project, and seeds six
  teaching, admin, and research tasks.
- The command creates a low-energy, 90-minute, light-work check-in and rebuilds
  the current today plan.
- Added `--reset` for a clean repeatable dataset.
- Added `--include-outcomes` to seed accepted, snoozed, dismissed, and feedback
  records for admin dashboard demonstration.
- Added focused tests for dataset creation, idempotency, sample outcomes, and
  reset behavior.
- Updated `CAPSTONE_EVALUATION_METHOD.md` with the seeded walkthrough command.

### Verification

```text
api: uv run ruff check upoutodo/management/commands/seed_planner_evaluation_demo.py upoutodo/tests/management/test_seed_planner_evaluation_demo.py
api: uv run ruff format --check upoutodo/management/commands/seed_planner_evaluation_demo.py upoutodo/tests/management/test_seed_planner_evaluation_demo.py
api: uv run pytest --no-cov upoutodo/tests/management/test_seed_planner_evaluation_demo.py
repo: git diff --check
```

### Study Notes

- This gives the capstone a practical demonstration artifact: the same planner
  scenario can be recreated locally before screenshots, pilot walkthroughs, or
  adviser demos.
- Seeded data should be labeled as demo data. It should not be mixed with
  actual participant results.

## 2026-06-28: Capstone Evaluation Walkthrough Protocol

### Goal

Turn the evaluation method and seeded demo dataset into a practical moderator
protocol that can be used for adviser demos, pilot testing, screenshots, or a
small capstone walkthrough.

### Human Decisions And Constraints

- The walkthrough should evaluate the planner-first daily decision flow, not the
  full generic task-management surface.
- The protocol should preserve the faculty/staff scope and keep student use
  cases as adjacent or future work.
- The protocol should separate seeded demo evidence from actual participant
  findings.
- Observation notes should avoid private task content, names, emails, and raw
  identifying feedback.

### Codex-Assisted Actions

- Added `CAPSTONE_EVALUATION_WALKTHROUGH.md`.
- Included setup commands, seeded demo credentials, participant scenario,
  moderator script, walkthrough tasks, observation checklist, post-task
  questions, recording template, metric review guidance, interpretation guide,
  privacy rules, and a paper-ready walkthrough paragraph.
- Linked the walkthrough from `CAPSTONE_EVALUATION_METHOD.md` and
  `CAPSTONE_NOTES.md`.

### Verification

```text
repo: git diff --check
repo: git diff --cached --check
```

### Study Notes

- This artifact makes the evaluation runnable. The method explains what is
  being evaluated; the walkthrough explains exactly how to conduct it.
- The walkthrough gives the capstone a cleaner bridge from implementation
  artifacts to evaluation data collection.

## 2026-06-28: Playwright Planner Evaluation Demo Run

### Goal

Run the capstone evaluation walkthrough through Playwright so the demo flow is
verified in a real browser and recorded as a repeatable artifact.

### Human Decisions And Constraints

- The existing `/today` Playwright regression spec uses mocked API responses and
  is not a capstone walkthrough artifact.
- Full backend-authenticated browser execution is not ready because the
  frontend E2E auth state uses a mock token while the backend JWT decoder still
  expects real Auth0-style keys.
- The practical demo should therefore use Playwright fixtures that mirror the
  seeded planner evaluation dataset.
- The result should be labeled as demo evidence, not participant evidence.

### Codex-Assisted Actions

- Added `ui/tests/e2e/planner-evaluation-demo.spec.ts`.
- The spec exercises the walkthrough flow on `/today`:
  low-energy planner mode, check-in update, reason inspection, accept, snooze,
  dismiss, and feedback submission.
- Added `CAPSTONE_DEMO_RUN.md` with the command, result, screenshot path,
  walkthrough coverage, and demo-data boundary.
- Updated `CAPSTONE_EVALUATION_WALKTHROUGH.md` with the automated Playwright
  demo command.

### Verification

```text
ui: eslint tests/e2e/planner-evaluation-demo.spec.ts --max-warnings 0
ui: Playwright tests/e2e/planner-evaluation-demo.spec.ts --project=chromium
repo: git diff --check
repo: git diff --cached --check
```

Observed result:

```text
Playwright: 2 passed (6.8s)
```

### Study Notes

- The demo run validates the visible HCI flow, including suggestion reasoning
  and feedback capture.
- It does not validate backend persistence because the browser run is currently
  fixture-backed.
- The failed first pass exposed two harness assumptions: the app shell requires
  a default Inbox project, and broad action selectors can accidentally target
  the wrong suggestion card.

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

## 2026-06-28: Real-Backend Planner Evaluation Demo

### Goal

Bridge the Playwright walkthrough from fixture-backed UI verification to a
local Django-backed browser run that proves the seeded planner demo can persist
through typed backend endpoints.

### Human Decisions And Constraints

- Keep the demo local and explicitly test-gated; do not make fake bearer-token
  authentication available in normal development or production.
- Preserve the existing Django backend as the system of record.
- Keep `/today` planner-first and use the browser run as demo evidence, not
  participant evidence.

### Codex-Assisted Actions

- Added a test-only `E2EBearerTokenAuthentication` class gated by `DEBUG` or
  test mode plus `E2E_TEST_MODE=1` and `DJANGO_ALLOW_TEST_ENDPOINTS=1`.
- Added backend tests proving the E2E token authenticates only when explicitly
  enabled and rejects missing seeded users.
- Added `playwright.real-backend.config.ts` to start Django, run migrations,
  seed the planner evaluation demo, start Vite, and route `/api` through the
  local backend.
- Added `tests/e2e/planner-evaluation-real-backend.spec.ts` to exercise
  check-in update, suggestion accept/snooze/dismiss, and feedback submission
  through real API calls.
- Made the Vite API proxy target configurable for isolated Playwright backend
  ports.
- Fixed `useNotifications()` to normalize both DRF paginated responses and
  plain arrays, then added a focused unit test.
- Updated `CAPSTONE_DEMO_RUN.md` and
  `CAPSTONE_EVALUATION_WALKTHROUGH.md` with the real-backend command and
  result.

### Verification

```text
api: ruff check api/settings.py upoutodo/authentication.py upoutodo/tests/endpoints/test_e2e_authentication.py
api: pytest --no-cov upoutodo/tests/endpoints/test_e2e_authentication.py
ui: eslint vite.config.ts playwright.real-backend.config.ts tests/setup/auth.setup.ts tests/e2e/planner-evaluation-real-backend.spec.ts src/modules/shared/hooks/queries.ts src/modules/shared/hooks/__tests__/queries.test.ts --max-warnings 0
ui: vitest run src/modules/shared/hooks/__tests__/queries.test.ts
ui: Playwright real-backend planner evaluation demo
```

Observed result:

```text
Backend E2E auth tests: 3 passed
Notification normalizer unit tests: 3 passed
Playwright real-backend demo: 2 passed (9.6s)
```

### Study Notes

- This run validates the planner workflow across UI, authentication, Django
  routes, seeded database state, planner mutations, and feedback capture.
- The browser run found a real integration mismatch between the frontend
  notification hook and DRF pagination. That is useful study evidence for
  Codex-assisted development: the E2E harness exposed a bug that isolated UI
  fixtures did not.
- The test-only bearer-token path is typed and still goes through DRF
  permissions, serializers, and viewsets; it does not give the chat/UI direct
  database access.

## 2026-06-28: Planner Demo Script Shortcuts

### Goal

Make the capstone planner walkthrough demos repeatable without copying
machine-specific Playwright commands into the terminal.

### Codex-Assisted Actions

- Added `npm run test:e2e:planner-demo` for the fixture-backed planner
  walkthrough.
- Added `npm run test:e2e:planner-real` for the Django-backed planner
  walkthrough.
- Added `ui/.nvmrc` and a `node >=18` package engine because the default shell
  resolved Node 14, which cannot run Playwright.
- Updated `CAPSTONE_DEMO_RUN.md` and
  `CAPSTONE_EVALUATION_WALKTHROUGH.md` to reference the short commands.

### Verification

```text
ui: npm run test:e2e:planner-demo
ui: npm run test:e2e:planner-real
```

Observed result with Node 22.11.0 active:

```text
Planner fixture-backed demo: 2 passed (7.2s)
Planner real-backend demo: 2 passed (10.8s)
```

### Study Notes

- The short commands make the demo protocol easier to rerun during adviser
  reviews, screenshots, and future Codex-assisted sessions.
- The first shortcut run failed under Node 14, so future demo runs should use
  `nvm use` or otherwise activate Node 18+ before running `npm run`.

## 2026-06-28: Planner Schema Warning Cleanup

### Goal

Reduce high-signal OpenAPI noise from the real-backend planner demo without
turning this into a broad schema refactor.

### Codex-Assisted Actions

- Added a default serializer class to `PlannerViewSet` so drf-spectacular can
  discover the planner viewset without falling back.
- Made `NotificationViewSet.get_queryset()` safe during schema generation by
  returning `Notification.objects.none()` for fake schema views.
- Added an `E2ETestBearer` drf-spectacular authentication extension for the
  test-only E2E bearer authenticator.
- Loaded the schema extension from the app config.
- Extended the planner OpenAPI test to assert the E2E bearer scheme.

### Verification

```text
api: ruff check upoutodo/apps.py upoutodo/schema.py upoutodo/views/planner.py upoutodo/views/notification.py upoutodo/tests/endpoints/test_planner.py
api: pytest --no-cov upoutodo/tests/endpoints/test_planner.py upoutodo/tests/endpoints/test_e2e_authentication.py upoutodo/tests/test_notifications.py
api: DEBUG=True uv run python manage.py spectacular --file /private/tmp/upoutodo-schema.yaml
ui: npm run test:e2e:planner-real
```

Observed result:

```text
Backend focused tests: 31 passed
Real-backend planner demo: 2 passed (9.8s)
```

### Study Notes

- The cleanup removed the planner serializer warning, notification fake-queryset
  warning, and repeated E2E authenticator schema warnings from the real-backend
  demo output.
- Remaining schema output is older generic contract work: serializer method
  field type hints, duplicate nested user serializers, and serializer
  declarations for admin/productivity/email API views.

## 2026-06-28: Original SRS Import And Traceability

### Goal

Bring the original ReadySET SRS/proposal documents into the current capstone
repo and reconcile them with the Django/React planner-first implementation.

### Codex-Assisted Actions

- Located the local repository that hosts
  `https://gumacahin.github.io/is295proj/` at
  `/Users/marcoenrico/Projects/is295proj`.
- Verified that its Git remote is `https://github.com/gumacahin/is295proj`.
- Copied the original `docs/` folder into the current capstone repository.
- Reviewed the ReadySET SRS, feature set, use case suite, proposal, user needs,
  and relevant templates.
- Identified the most useful ReadySET templates for the current study: SRS,
  feature set, use cases, user needs, UI design, architecture, security, QA,
  demo script, and interview notes.
- Created `SRS_TRACEABILITY_MATRIX.md` to map the original SRS items to current
  implementation evidence, status, and planner-first interpretation.
- Updated `CAPSTONE_NOTES.md`, `FREEZE_NOTES.md`, and
  `JIT_PLANNER_UI_SPEC.md` to reference the traceability matrix.

### Study Notes

- The current project can be defended as satisfying the original SRS baseline
  while reinterpreting the differentiating requirement around suggested tasks.
- Generic task-management features are now framed as the system of record.
- The capstone contribution is the just-in-time planner UI that helps faculty
  and staff answer "What should I do today?"
- Gen UI should be described as the design strategy for SRS items `F-12`
  suggested tasks, `F-21` personal scheduling, `F-41` productivity analytics,
  and `F-42` energy tracking, not as an unrelated new requirement.
- Optional SRS items such as Google Calendar integration, OUIC integration,
  group scheduling, motivation, and full voice/conversational UI remain future
  work unless the capstone scope changes.

## 2026-06-28: Capstone Argument Outline

### Goal

Create a concise paper and defense narrative that connects Crisanto's study,
the original WSIDT SRS, the current implementation, generative UI, and the
evaluation method.

### Codex-Assisted Actions

- Added `CAPSTONE_ARGUMENT.md` as the high-level argument document.
- Framed the current implementation as a planner-first MVP that preserves the
  SRS baseline while focusing the contribution on suggested daily planning.
- Clarified that generative UI is the design strategy for the SRS planning
  requirements, not a separate requirement invented outside the SRS.
- Added paper-section mapping, defense talking points, claims to make, and
  claims to avoid.
- Linked the argument document from `CAPSTONE_NOTES.md`.

### Study Notes

- The strongest capstone claim is that just-in-time UI turns task data into
  contextual planning support.
- The defense should avoid claiming that the app is a full replacement for
  existing task managers or calendars.
- The implementation should be evaluated by helpfulness, confidence,
  explanation quality, and user action on suggestions.

## 2026-06-28: Capstone Defense Demo Script

### Goal

Create a practical defense/demo script that presents the capstone argument,
shows the planner-first implementation, and provides a fallback path if the live
environment fails.

### Codex-Assisted Actions

- Added `CAPSTONE_DEFENSE_DEMO_SCRIPT.md`.
- Structured the demo around Crisanto's study, the original SRS, typed
  architecture, the live `/today` planner flow, Gen UI modes, evaluation, and
  limitations.
- Included setup commands for the real-backend Playwright demo and seeded
  manual walkthrough data.
- Added expected defense questions and answers.
- Added a fallback plan using `CAPSTONE_DEMO_RUN.md`, the traceability matrix,
  the argument document, the JIT UI spec, and the evaluation method.
- Linked the demo script from `CAPSTONE_NOTES.md`.

### Study Notes

- The defense should show both product traceability and live behavior.
- The live demo should focus on check-in, suggestion reasons, accept/snooze or
  dismiss actions, and feedback submission.
- The fallback path matters because browser/backend demos can fail for
  environmental reasons even when the implementation is valid.

## 2026-06-28: Real-Backend Defense Rehearsal

### Goal

Run the defense demo path against the real Django backend and Vite frontend,
then record the result as demo-readiness evidence.

### Codex-Assisted Actions

- Checked that the repository was clean before rehearsal.
- Confirmed the default shell resolves Node 14.18.1, which is too old for this
  Playwright flow.
- Ran `npm run test:e2e:planner-real` with the project Node 22.11.0 path.
- The first sandboxed run failed because `uv` could not access
  `/Users/marcoenrico/.cache/uv`.
- Reran the same command with elevated local access so Django could start.
- Added `CAPSTONE_REHEARSAL_NOTES.md` with the command, result, local
  screenshot path, non-blocking warnings, and interpretation.
- Linked rehearsal notes from `CAPSTONE_NOTES.md`.

### Verification

```text
ui: npm run test:e2e:planner-real
```

Observed result:

```text
Real-backend planner demo: 2 passed (11.5s)
```

### Study Notes

- This is demo-readiness evidence, not participant evaluation evidence.
- The real-backend run exercised browser UI, backend routes, database
  persistence, typed planner actions, and planner feedback submission.
- Remaining schema and naive datetime warnings are non-blocking but should stay
  visible as known engineering debt.

## 2026-06-28: Faculty/Staff Scope Copy Alignment

### Goal

Align user-facing product copy with the capstone narrative that focuses the
current planner evaluation on UPOU faculty and staff, while keeping existing
student profile fields as compatibility and future-scope data.

### Codex-Assisted Actions

- Updated the DRF schema description to describe the backend as a
  planner-first productivity API for UPOU faculty and staff.
- Updated homepage, PWA metadata, onboarding, and settings copy from generic
  student/faculty task-management language to faculty/staff planning language.
- Kept `is_student` and `is_faculty` behavior intact so existing profile data
  and API contracts are not broken by a wording-only scope alignment.
- Regenerated the OpenAPI schema successfully and observed the known schema
  warnings.
- Deferred full generated-client refresh because it created broad formatting
  churn unrelated to this change, then mechanically aligned the stale generated
  file headers with the new schema description.

### Verification

```text
api: uv run ruff check api/settings.py
ui: npx eslint src/pages/HomePage.tsx src/pages/OnboardingPage.tsx src/pages/SettingsPage.tsx --max-warnings 0
ui: npx prettier --check index.html public/manifest.json src/pages/HomePage.tsx src/pages/OnboardingPage.tsx src/pages/SettingsPage.tsx
ui: npm run test:e2e:planner-demo
repo: git diff --check
```

Observed result:

```text
Planner demo e2e: 2 passed (8.7s)
```

### Study Notes

- The project can acknowledge students as adjacent or future scope without
  making the current capstone evaluation depend on student participants.
- This keeps the implemented product closer to Crisanto's original faculty
  planning problem while preserving the original SRS history.

## 2026-06-28: Frontend Lint Baseline Cleanup

### Goal

Make the frontend lint command trustworthy again before adding more planner
features, so future UI changes can rely on a clean full-project lint signal.

### Codex-Assisted Actions

- Reproduced the full `npm run lint` failure from a clean worktree.
- Replaced `any` casts in task cache invalidation with TanStack Query types and
  explicit query-key shape checks.
- Replaced `import.meta` `any` casts in Auth0 config with a typed optional env
  wrapper.
- Cleaned duplicate and default/named import warnings in `InboxPage`.
- Let ESLint/Prettier fix service worker formatting and removed stale unused
  imports from project component tests.
- Replaced skipped-test CommonJS `require()` mock access with typed Vitest
  mocked hook imports.
- Removed focused `.only` markers from project tests.
- Updated stale project divider and upcoming-page tests to assert current UI
  behavior.

### Verification

```text
ui: npm run lint
ui: npm run build
ui: npx vitest run src/modules/projects/components/__tests__
ui: npm run test:e2e:planner-demo
ui: playwright test tests/e2e/upcoming-page.spec.ts --project=chromium
repo: git diff --check
```

Observed result:

```text
Full frontend lint: passed
Frontend build: passed
Project component tests: 15 passed, 5 skipped; 26 tests passed, 19 skipped
Planner demo e2e: 2 passed (5.8s)
Upcoming page e2e: 2 passed (6.1s)
```

### Study Notes

- A clean lint baseline makes future Codex-assisted UI work easier to audit
  because unrelated lint noise no longer hides new regressions.
- The skipped project component tests still represent test-suite debt, but they
  no longer block lint or contain focused-test markers.

## 2026-06-28: Planner Evaluation Feedback Polish

### Goal

Make the `/today` planner flow more explicit as a capstone evaluation artifact:
when a user updates the check-in, accepts/snoozes/dismisses a suggestion, or
saves feedback, the UI should visibly confirm that the action was captured as
planner evaluation evidence.

### Codex-Assisted Actions

- Added planner surface notices for successful and failed check-in updates.
- Added planner surface notices for accepted, snoozed, and dismissed
  suggestions.
- Added planner surface notices for saved or failed feedback submission.
- Added feedback-card copy explaining that ratings are aggregate evaluation
  evidence for whether the suggestions helped the user decide what to do today.
- Updated mocked and real-backend Playwright tests to assert the new evaluation
  confirmations.

### Verification

```text
ui: npx eslint src/modules/planner/components/PlannerSurface.tsx src/modules/planner/components/PlannerFeedbackCard.tsx tests/e2e/today-page.spec.ts tests/e2e/planner-evaluation-demo.spec.ts tests/e2e/planner-evaluation-real-backend.spec.ts --max-warnings 0
ui: npx vitest run src/modules/planner/__tests__
ui: npm run test:e2e:planner-demo
ui: playwright test tests/e2e/today-page.spec.ts --project=chromium
ui: npm run build
ui: playwright test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
ui: npm run lint
repo: git diff --check
```

Observed result:

```text
Planner unit tests: 2 files passed, 11 tests passed
Planner demo e2e: 2 passed (7.6s)
Today page e2e: 8 passed (24.8s)
Frontend build: passed
Real-backend planner demo: 2 passed (15.3s)
Full frontend lint: passed
```

### Study Notes

- This makes the just-in-time planner UI more defensible in the capstone
  narrative because user actions and feedback are visibly connected to the
  evaluation method.
- The change keeps persistence behind existing typed planner operations; no raw
  database access or generic task-management expansion was introduced.

## 2026-06-28: Planner Evaluation Dashboard Polish

### Goal

Make the admin planner evaluation panel defense-ready by presenting only
aggregate/anonymized metrics and explaining what each metric contributes to the
capstone claim.

### Codex-Assisted Actions

- Added an aggregate-only privacy note to the planner evaluation panel.
- Added presentation chips for capstone evidence, just-in-time planning, and
  anonymized aggregates.
- Grouped planner metrics into adoption/response metrics and suggestion action
  signals.
- Added evidence labels to each metric so the dashboard can be used directly in
  the capstone defense.
- Updated the admin dashboard unit test to assert the aggregate privacy note,
  evidence framing, and metric values.

### Verification

```text
ui: npx prettier --check src/modules/admin/components/AdminDashboard.tsx src/modules/admin/components/__tests__/AdminDashboard.test.tsx
ui: npx eslint src/modules/admin/components/AdminDashboard.tsx src/modules/admin/components/__tests__/AdminDashboard.test.tsx --max-warnings 0
ui: npx vitest run src/modules/admin/components/__tests__/AdminDashboard.test.tsx
ui: npm run lint
ui: npm run build
repo: git diff --check
```

Observed result:

```text
Admin dashboard test: 1 passed
Full frontend lint: passed
Frontend build: passed
```

### Study Notes

- This supports the capstone narrative without exposing individual task content
  or participant notes in the evaluation surface.
- The metrics now connect the implementation to evaluation claims: adoption,
  feedback response, perceived usefulness, confidence, and action quality.

## 2026-06-28: Post-Polish Capstone Demo Rehearsal

### Goal

Refresh the demo-readiness evidence after the planner feedback and admin
evaluation dashboard polish.

### Codex-Assisted Actions

- Re-ran the real-backend planner Playwright walkthrough against Django and
  Vite using the seeded planner demo user.
- Re-ran the targeted admin dashboard unit test for the aggregate evaluation
  panel.
- Updated the rehearsal notes with the latest verification results and known
  non-blocking warnings.
- Updated the defense demo script to explicitly call out planner action
  confirmation messages and aggregate dashboard evidence.

### Verification

```text
ui: playwright test --config=playwright.real-backend.config.ts tests/e2e/planner-evaluation-real-backend.spec.ts --project=chromium
ui: npx vitest run src/modules/admin/components/__tests__/AdminDashboard.test.tsx
```

Observed result:

```text
Real-backend planner demo: 2 passed (10.1s)
Admin dashboard test: 1 passed
```

### Study Notes

- The latest evidence supports a defense claim that `/today` persists planner
  actions through typed backend endpoints and reports evaluation signals only in
  aggregate form.
- This remains implementation/demo evidence. Participant or adviser feedback
  should be recorded separately from automated Playwright verification.

## 2026-06-28: OpenAPI Contract Cleanup

### Goal

Reduce recurring schema-generation warnings so the API contract is clearer for
the planner-first direction and future typed chat or MCP-style operations.

### Codex-Assisted Actions

- Added explicit drf-spectacular schema annotations for older serializer method
  fields on tasks, project sections, tags, and users.
- Gave nested user project serializers distinct schema component names to avoid
  duplicate OpenAPI component warnings.
- Added response serializers for the admin dashboard and user productivity
  endpoints.
- Added explicit response documentation for the protected daily digest trigger.
- Extended backend schema tests to cover reporting contracts and daily digest
  response documentation.

### Verification

```text
api: DEBUG=True uv run python manage.py spectacular --file /private/tmp/upoutodo-schema.yaml
api: DEBUG=True uv run ruff check upoutodo/serializers/task.py upoutodo/serializers/project_section.py upoutodo/serializers/tag.py upoutodo/serializers/user.py upoutodo/views/admin.py upoutodo/views/productivity.py upoutodo/views/email.py upoutodo/tests/endpoints/test_planner.py
api: DEBUG=True uv run pytest --no-cov upoutodo/tests/endpoints/test_admin.py upoutodo/tests/endpoints/test_email.py upoutodo/tests/endpoints/test_planner.py::test_openapi_schema_documents_planner_contract upoutodo/tests/endpoints/test_planner.py::test_openapi_schema_documents_reporting_contracts
repo: git diff --check
```

Observed result:

```text
OpenAPI schema generation: passed with no warnings or errors
Ruff targeted backend check: passed
Admin/email/schema endpoint tests: 13 passed
```

### Study Notes

- This strengthens the "typed operations" architecture because the backend
  contract is now more explicit and less ambiguous.
- The change is intentionally schema-facing; it does not expand generic todo
  features or change endpoint payload behavior.
