# Just-in-Time Planner UI Spec

Date: 2026-06-28

## Purpose

This document defines how the planner can use just-in-time UI to help users
answer the core product question:

```text
What should I do today?
```

The purpose is not to let an AI model generate arbitrary frontend code. The
purpose is to let the system choose from a small set of safe, prebuilt planner
components based on the user's current situation.

This spec is a design artifact for the capstone. It connects the source paper's
planning problem to a concrete product approach: adaptive planner interfaces
that appear when they help reduce planning friction.

## Key Terms

**Artifact**

A concrete project output that documents, demonstrates, or validates part of
the capstone work. Examples include code, tests, design specs, diagrams,
development journals, and prototypes.

**HCI**

Human-Computer Interaction. This is the field that studies how people use
software and whether a system is understandable, useful, efficient, trustworthy,
and aligned with real user needs.

**Generative UI**

An interface pattern where AI helps produce or adapt the interface based on the
user's current goal, context, or task.

In this project, generative UI should mean generating a structured UI decision,
not generating raw executable frontend code.

**Just-in-Time UI**

UI that appears only when it is relevant to the user's current situation. For
example, a low-energy planning card appears when the user says they feel tired,
instead of showing that card all the time.

**Intent**

What the user is trying to accomplish. Example: "I have 45 minutes before a
meeting; what should I work on?"

**Component Registry**

A fixed list of React components that the planner or assistant is allowed to
show. The assistant can select from this list, but it cannot invent arbitrary UI.

**UI Schema**

Structured data that tells the frontend which registered component to render and
what props to pass into it.

**Typed Operation**

A predefined backend action with structured inputs, validation, permission
checks, and predictable side effects. Example:
`accept_suggestion(suggestion_id)`.

**Grounding**

Ensuring that planner suggestions come from real app data, such as the user's
tasks, due dates, priorities, check-ins, and calendar context. Grounding avoids
invented tasks or unsupported recommendations.

**Human-in-the-Loop**

A safety pattern where the assistant may suggest an action, but the user
confirms before the system changes important state.

**Cognitive Load**

The mental effort required to understand and use the system. A planner-first UI
should reduce the user's cognitive load when deciding what to do next.

## Product Thesis

The current todo backend answers:

```text
What tasks do I have?
```

The planner should answer:

```text
Given my tasks, deadlines, energy, and available time, what should I do today?
```

Just-in-time UI supports this thesis by showing the right planning interface at
the moment the user needs it, rather than forcing every planning scenario into a
static task list.

## Non-Goals

- Do not generate arbitrary JSX, HTML, CSS, SQL, or ORM queries at runtime.
- Do not let an assistant mutate the database directly.
- Do not expand generic task-management features unless they support planning.
- Do not replace the Django backend as the system of record.
- Do not treat Google Calendar as the primary todo database.

## Core User Situations

### Situation 1: The User Does Not Know What To Do Today

User intent:

```text
I need help deciding what to work on.
```

Likely UI:

- `EnergyCheckInCard`
- `TodayPlanCard`
- `SuggestionReasonCard`

Backend operations:

- `get_today_plan`
- `submit_check_in`
- `accept_suggestion`
- `snooze_suggestion`
- `dismiss_suggestion`

Success signal:

- The user accepts at least one suggested task.
- The user reports higher confidence in what to do next.

### Situation 2: The User Has Low Energy

User intent:

```text
I am tired. What can I still make progress on?
```

Likely UI:

- `LowEnergyPlanCard`
- `TodayPlanCard`
- `SuggestionReasonCard`

Backend operations:

- `submit_check_in`
- `get_today_plan`
- `accept_suggestion`
- `snooze_suggestion`

Success signal:

- The system suggests smaller, lower-friction tasks.
- The user can still choose a realistic next action.

### Situation 3: The User Has Limited Time

User intent:

```text
I only have 30 to 60 minutes available.
```

Likely UI:

- `TimeBoxPlanCard`
- `TodayPlanCard`
- `SchedulePreviewCard`

Backend operations:

- `submit_check_in`
- `get_today_plan`
- `accept_suggestion`
- later: `schedule_plan_item`

Success signal:

- Suggestions fit inside the available time window.
- The user can choose one task without manually scanning the full task list.

### Situation 4: The User Has Too Many Overdue Tasks

User intent:

```text
I am overwhelmed by overdue work.
```

Likely UI:

- `TaskTriagePanel`
- `SuggestionReasonCard`
- `TodayPlanCard`

Backend operations:

- `get_today_plan`
- `rebuild_today_plan`
- `accept_suggestion`
- `snooze_suggestion`
- `dismiss_suggestion`

Success signal:

- The system narrows the overdue set into a small, explainable shortlist.
- The user dismisses or snoozes items without losing the underlying task record.

### Situation 5: The User Asks Why A Task Was Suggested

User intent:

```text
Why this task?
```

Likely UI:

- `SuggestionReasonCard`
- `TaskSignalBreakdown`

Backend operations:

- `get_today_plan`

Success signal:

- The user understands the recommendation.
- The explanation references concrete signals such as due date, priority,
  estimated effort, recurrence, or available time.

## Component Catalog

### `EnergyCheckInCard`

Purpose:

Collect or update the user's planning context for today.

Inputs:

- energy level
- available minutes
- focus mode
- optional context

Allowed operations:

- `submit_check_in`
- `get_today_plan`

Notes:

- This is the primary entry point for adaptive planning.
- The component should be compact enough to live at the top of `/today`.

### `TodayPlanCard`

Purpose:

Show the ordered recommended tasks for the current day.

Inputs:

- today plan
- suggestions
- suggestion status

Allowed operations:

- `accept_suggestion`
- `snooze_suggestion`
- `dismiss_suggestion`
- `rebuild_today_plan`

Notes:

- This is the main planner UI.
- It should show reasons, effort estimates, and clear action buttons.

### `LowEnergyPlanCard`

Purpose:

Show lighter suggested work when the user reports low energy.

Inputs:

- today plan
- energy level
- suggestions tagged or scored as lower effort

Allowed operations:

- `accept_suggestion`
- `snooze_suggestion`
- `dismiss_suggestion`

Notes:

- This can be a variant of `TodayPlanCard` rather than a fully separate
  component in the first implementation.

### `TimeBoxPlanCard`

Purpose:

Help the user choose tasks that fit a limited time window.

Inputs:

- available minutes
- task effort estimates
- today plan

Allowed operations:

- `submit_check_in`
- `accept_suggestion`
- later: `schedule_plan_item`

Notes:

- This becomes more valuable after Google Calendar context is available.

### `TaskTriagePanel`

Purpose:

Help the user reduce overwhelm when there are many overdue or high-priority
tasks.

Inputs:

- overdue tasks
- priority
- due date
- project
- suggestion score

Allowed operations:

- `accept_suggestion`
- `snooze_suggestion`
- `dismiss_suggestion`
- `rebuild_today_plan`

Notes:

- The panel should avoid becoming a full task-management replacement.
- Its job is to narrow choices for today.

### `SuggestionReasonCard`

Purpose:

Explain why a task was recommended.

Inputs:

- suggestion reason
- task signals
- check-in context

Allowed operations:

- `get_today_plan`

Notes:

- This is important for trust and capstone evaluation.
- Explanations should be concrete, not vague.

### `TaskSignalBreakdown`

Purpose:

Show the concrete task signals behind a recommendation.

Inputs:

- due date status
- overdue status
- priority
- estimated effort
- project or section
- recurrence
- snooze or dismiss history

Allowed operations:

- `get_today_plan`

Notes:

- This can start as a small details area inside `SuggestionReasonCard`.
- The goal is transparency, not exposing every internal scoring detail.

### `SchedulePreviewCard`

Purpose:

Preview where accepted plan items could fit in the day.

Inputs:

- accepted suggestions
- available time windows
- optional calendar events

Allowed operations:

- later: `schedule_plan_item`
- later: `sync_calendar_block`

Notes:

- This should be future work after planner actions stabilize.
- Google Calendar should be used as scheduling context or sync destination, not
  as the primary task store.

## UI Schema

The assistant or planner can return a structured UI decision like this:

```json
{
  "component": "TodayPlanCard",
  "mode": "low_energy",
  "title": "Suggested next actions",
  "message": "Here are tasks that fit your low-energy check-in.",
  "suggestion_ids": [40, 41, 42],
  "allowed_actions": ["accept_suggestion", "snooze_suggestion", "dismiss_suggestion"]
}
```

The frontend should only render components listed in the component registry. If
the component name is unknown, the frontend should fall back to a safe default
such as `TodayPlanCard` or a plain text message.

## Typed Operation Map

| Operation | User Confirmation Needed | Mutates State | Current Status |
| --- | --- | --- | --- |
| `get_today_plan` | No | No | Implemented |
| `submit_check_in` | Submit button | Yes | Implemented |
| `rebuild_today_plan` | Button click | Yes | Implemented |
| `accept_suggestion` | Button click | Yes | Implemented |
| `snooze_suggestion` | Button click | Yes | Implemented |
| `dismiss_suggestion` | Button click | Yes | Implemented |
| `schedule_plan_item` | Explicit confirmation | Yes | Future |
| `sync_calendar_block` | Explicit confirmation | Yes | Future |

## Safety Rules

- The assistant may suggest UI, but React renders only registered components.
- The assistant may suggest actions, but meaningful state changes require user
  confirmation.
- Django validates ownership, permissions, and input fields.
- The assistant never receives raw SQL or unrestricted ORM access.
- The assistant should not invent tasks, deadlines, priorities, or calendar
  events.
- Calendar sync should be opt-in and reversible where possible.
- Suggestion reasons should reference real task signals.

## Evaluation Criteria

The capstone can evaluate the just-in-time planner UI using these questions:

- Did the user decide what to do faster than with a static task list?
- Did the user understand why tasks were suggested?
- Did the UI reduce overwhelm or cognitive load?
- Did the user trust the recommendations?
- Did the user accept, snooze, or dismiss suggestions confidently?
- Did the UI avoid hiding important task information?

Possible measures:

- time to choose a first task
- number of accepted suggestions
- number of plan rebuilds
- user rating of suggestion clarity
- user rating of confidence after planning
- user rating of workload fit

## MVP Flow

The first just-in-time planner flow should be:

1. User opens `/today`.
2. User sees `EnergyCheckInCard`.
3. User submits energy, available time, focus mode, and optional context.
4. Backend updates the check-in and rebuilds or refreshes the today plan.
5. Frontend shows `TodayPlanCard`.
6. User can accept, snooze, dismiss, or ask why.
7. If the user asks why, the UI shows `SuggestionReasonCard`.

This MVP is enough to demonstrate the product direction without adding calendar
sync, general chat, or runtime-generated frontend code.

## Implementation Notes

The current implementation supports the first JIT planner UI slice:

- Django owns planner state through `EnergyCheckIn`, `TodayPlan`, and `PlanItem`.
- The planner API exposes typed endpoints for check-ins and suggestion actions.
- Planner suggestion responses include structured task signals for due status,
  priority, effort, recurrence, project/section, score, and snooze/dismiss
  history.
- The React UI has a typed planner client in `ui/src/modules/planner`.
- Planner endpoints are documented in the OpenAPI schema and available through
  the generated TypeScript client.
- `/today` renders planner UI through a component registry and UI schema.
- The current planner panel has been extracted into named catalog components:
  `EnergyCheckInCard`, `TodayPlanCard` behavior through `PlanSuggestionsCard`,
  `SuggestionReasonCard`, and `TaskSignalBreakdown`.
- The registry can select low-energy, limited-time, and overdue-triage modes
  while preserving the same typed backend operations.
- Unit tests cover the schema selection rules for default, low-energy,
  limited-time, overdue-triage, unavailable, loading or empty, and dismissed
  suggestion states.
- Playwright verifies check-in, acceptance, snooze, dismiss, empty-state,
  unavailable-state, low-energy mode, and reason-details behavior.

Next implementation steps:

1. Keep the OpenAPI planner contract test updated as planner operations evolve.
2. Defer chat and Google Calendar sync until the component registry and typed
   planner operations are stable.

## Open Questions

- Should suggestion reasons be shown inline by default, or expanded only when
  the user asks why?
- How many suggestions should appear before the UI feels overwhelming?
- Should low-energy mode be a separate card or just a mode of `TodayPlanCard`?
- What task signals should be exposed to the user versus kept internal?
- Should plan rebuilds happen automatically after every check-in update, or only
  when the user explicitly asks?
- What minimal Google Calendar context is needed before scheduling previews are
  useful?
