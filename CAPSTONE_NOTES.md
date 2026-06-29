# Capstone Notes

## Target User Scope Refinement

The initial project concept mentioned **faculty and students** as possible users of
the planner and productivity tracker. However, the source study by Crisanto,
`"What should I do today?" A Case Study on the Current Practices and Software
Requirements Specification of a Web-Based Planner and Productivity Tracker`,
gathered requirements from UPOU employees, specifically faculty, research
assistants, and staff.

For the capstone paper and implementation, the target users should therefore be
framed as **UPOU faculty and staff** to align with the original evidence base of
the study. Student use cases can be described as adjacent or future-extension
possibilities, but they should not be treated as the primary validated scope of
the current implementation.

Suggested wording:

```text
The initial project concept considered both faculty and students as possible
users of a planner and productivity tracker. However, the source study used for
requirements grounding focused on UPOU faculty and staff. Therefore, this
project treats UPOU faculty and staff as the primary user group for the current
implementation. Student use cases are considered adjacent and may be supported in
future iterations, but they are outside the primary validation scope of this
version.
```

## Capstone Narrative

The capstone narrative should emphasize that the project is **not simply another
generic todo list**. The stronger framing is:

> `"What should I do today?": a planner-first productivity tracker for UPOU
faculty and staff.`

The problem is not only that users need somewhere to store tasks. Crisanto's
study shows that UPOU faculty and staff already use different planning and
tracking methods, including Google Calendar, paper planners, and paper-based
goal setting. The implementation should therefore focus on reducing planning
fragmentation and helping users decide what work to do next.

Useful distinction:

```text
Generic task app:
"What tasks do I have?"

This capstone app:
"Given my tasks, deadlines, energy, and available time, what should I do today?"
```

Suggested wording:

```text
This capstone implements a planner-first productivity tracker grounded in
Crisanto's study of UPOU faculty and staff planning practices. While the
implementation includes basic task-management features, the project's core
contribution is not another generic todo system. Instead, it focuses on the
daily planning question raised by the study title: "What should I do today?"
The system uses tasks, due dates, priorities, recurrence, and user check-ins
such as energy level and available time to generate explainable daily
suggestions. This positions the application as a decision-support layer for
planning and productivity tracking, with future extensibility for Google
Calendar synchronization and conversational planning through typed tool actions.
```

The fuller paper and defense outline is captured in `CAPSTONE_ARGUMENT.md`.

## Typed Operations

In this project, **typed** means that the application exposes a small set of
explicit, structured operations instead of letting an LLM, chat UI, or external
tool freely mutate the database.

Examples of typed planner operations:

```text
get_today_plan()
submit_check_in(energy_level, available_minutes, focus_mode, context)
accept_suggestion(suggestion_id)
snooze_suggestion(suggestion_id, minutes)
dismiss_suggestion(suggestion_id)
schedule_plan_item(plan_item_id, start_time, end_time)
```

Each operation has:

- a clear name
- expected input fields
- validation rules
- permission checks
- predictable side effects

This is different from giving a model direct SQL, raw database access, or a
free-form "update anything" endpoint. Typed operations are safer and easier to
explain in the capstone because Django remains responsible for ownership,
validation, auditability, and business rules.

Short explanation:

```text
"Typed operations" means the chat or assistant can only call predefined backend
actions with structured inputs, such as accepting a suggestion or submitting a
check-in. It cannot directly access or modify database tables. This keeps the
planner controllable, testable, and permission-safe.
```

## Codex-Assisted Development As Study Artifact

Working with Codex can be documented as part of the capstone development method.
The project should not treat Codex as an independent source of requirements or
validation. Instead, Codex is best framed as an AI-assisted development tool used
for code review, implementation support, test creation, and documentation.

Suggested wording:

```text
This project also records the use of an AI coding assistant as part of the
software development process. Codex was used to support implementation, code
review, testing, and documentation. The developer retained decision authority
over requirements interpretation, scope, acceptance of generated changes, and
alignment with the source study. Codex-assisted changes were treated as
development artifacts and validated through automated tests and manual review.
```

Ongoing session notes should be kept in `DEV_JOURNAL.md`.

## Evaluation Method

The paper-facing evaluation plan is captured in
`CAPSTONE_EVALUATION_METHOD.md`.

The practical moderator walkthrough is captured in
`CAPSTONE_EVALUATION_WALKTHROUGH.md`.

The field-ready participant/adviser packet is captured in
`CAPSTONE_EVALUATION_PACKET.md`.

The evaluation results log is captured in `CAPSTONE_EVALUATION_RESULTS.md`.

The paper-facing results and discussion template is captured in
`CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`.

The defense-oriented demo script is captured in
`CAPSTONE_DEFENSE_DEMO_SCRIPT.md`.

Rehearsal results are captured in `CAPSTONE_REHEARSAL_NOTES.md`.

The short version:

```text
Evaluate the planner-first slice by asking UPOU faculty and staff to use
`/today`, complete a check-in, review and act on suggested tasks, inspect
suggestion reasons, and submit helpfulness/confidence feedback. Report only
aggregate planner metrics and anonymized qualitative observations.
```

## Just-in-Time Planner UI

The next product exploration is captured in `JIT_PLANNER_UI_SPEC.md`. The
important design decision is that the assistant should not generate arbitrary
frontend code. Instead, it should choose from a fixed registry of planner UI
components and call typed backend operations.

Short explanation:

```text
Just-in-time UI means the planner shows the interface needed for the user's
current planning situation. For example, if the user has low energy, the app can
show a low-energy planning card with lighter suggested tasks. The assistant can
select the card and explain the plan, but React renders only registered
components and Django validates all state-changing actions.
```

## SRS Reconciliation

The original ReadySET project documents have been copied into `docs/` from the
earlier WSIDT project repository. The reconciliation between that SRS and the
current implementation is captured in `SRS_TRACEABILITY_MATRIX.md`.

The important conclusion is that the project does not abandon the original SRS.
It treats the existing task-management features as the system-of-record
foundation, then elevates the SRS's suggested-tasks and energy-tracking
requirements into the planner-first capstone contribution.

Suggested wording:

```text
The original SRS defined WSIDT as a web-based task-management and
productivity-tracking application. This implementation preserves that baseline
through task, project, label, scheduling, notification, productivity, and
administrative features. The capstone contribution is the planner-first
reinterpretation of the SRS's suggested-tasks requirement: a just-in-time daily
planning interface that uses task signals, energy, available time, focus mode,
and user feedback to help faculty and staff decide what to do today.
```
