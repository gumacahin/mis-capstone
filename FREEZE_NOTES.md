# Freeze Notes

Date: 2026-06-27

## Purpose

This freeze captures the Django/React foundation after redirecting the capstone
from a generic todo clone toward a planner-first product based on the question:
"What should I do today?"

The current todo backend should be treated as a minimal system of record. It can
continue to own tasks, projects, sections, tags, recurrence, notifications,
permissions, validation, and audit-friendly state transitions, but it should not
expand into more generic Todoist/Trello-style features unless those features are
required by planning.

## Frozen Direction

- Django/DRF remains the authoritative backend for state, permissions,
  validation, ownership checks, and scheduler/admin boundaries.
- React should prioritize `/today` as the main planner dashboard.
- Planner features should answer what to do next using tasks, deadlines,
  priority, recurrence, energy, available time, and user context.
- Future chat, MCP, or assistant integrations must call typed backend
  operations only. They must not receive raw SQL, unrestricted ORM access, or
  broad "update anything" APIs.
- Google Calendar should be treated as a scheduling/sync destination for plan
  blocks, not the primary todo database.
- The original SRS is reconciled in `SRS_TRACEABILITY_MATRIX.md`; that matrix is
  the current scope boundary for what is implemented, reinterpreted, deferred,
  or outside the capstone MVP.

## Security And Privacy Baseline

The freeze includes the first security pass required before building more
planner features:

- User profile updates are allowlisted so clients cannot promote themselves by
  writing protected fields such as `is_admin`.
- Task foreign-key validation is scoped to the authenticated user's objects.
- Task bulk update now uses the user-scoped queryset and rejects missing or
  foreign task IDs before applying changes.
- Comments are filtered and created only for tasks owned by the current user.
- Daily digest is no longer public; it requires admin access or a scheduler
  secret.
- Admin UI access is narrowed to aggregate dashboard behavior instead of generic
  raw task/user CRUD exposure.
- Production settings are stricter around debug mode, CORS defaults, default
  secret key usage, and SQLite deployment.

## Planner Baseline

The freeze includes an initial planner MVP:

- `EnergyCheckIn`: daily energy, available time, focus mode, and context.
- `TodayPlan`: the user's generated plan for a day.
- `PlanItem`: ordered task suggestions with reason, estimated minutes, score,
  and accepted/snoozed/dismissed state.
- Planner endpoints:
  - `GET /api/planner/today/`
  - `POST /api/planner/check-in/`
  - `POST /api/planner/rebuild/`
  - `POST /api/planner/suggestions/{id}/accept/`
  - `POST /api/planner/suggestions/{id}/snooze/`
  - `POST /api/planner/suggestions/{id}/dismiss/`
- `/today` now shows the planner check-in and suggested next actions above the
  normal task list.
- Playwright now inspects `/today` with mocked planner APIs and verifies
  check-in and suggestion acceptance behavior.

## Verification At Freeze

The following checks passed before this note was added:

```text
api: uv run ruff check .
api: uv run pytest --no-cov
ui: npm run build
ui: targeted ESLint for changed frontend/config/E2E files
ui: Playwright tests/e2e/today-page.spec.ts --project=chromium
```

Backend result:

```text
221 passed, 7 known timezone warnings
```

Today E2E result:

```text
3 passed
```

## Known Remaining Debt

- Frontend co-located unit tests still have old type debt and are excluded from
  the app build gate. They should be repaired separately before relying on full
  unit-test typechecking as a quality gate.
- Planner endpoints are now included in the generated OpenAPI client. Keep the
  planner schema contract test updated as endpoint behavior changes.
- Admin generated-client coverage should be revisited separately if the admin UI
  needs generated operations again; the current planner UI does not rely on it.
- Scheduler deployment still needs an actual `DAILY_DIGEST_SCHEDULER_SECRET`.
- Production deployment still needs real environment values for Auth0, database,
  CORS origins, and secret key management.
- The planner scoring logic is deterministic and explainable, but still basic.
  It should be treated as a first MVP, not the final recommendation engine.

## Recommended Next Work

1. Use `SRS_TRACEABILITY_MATRIX.md` to keep the paper and demo aligned with the
   original SRS.
2. Polish `/today` planner UX and suggestion reasons.
3. Update the capstone paper with the faculty/staff scope, task management vs.
   planning distinction, and typed-operations architecture.
4. Add Google Calendar sync only after planner operations stabilize.
5. Decide whether admin/reporting APIs should remain aggregate-only or expose
   individual content under an explicit admin contract.
