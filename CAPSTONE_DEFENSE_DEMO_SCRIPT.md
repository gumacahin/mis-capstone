# Capstone Defense Demo Script

Date: 2026-06-28

## Purpose

This script turns the capstone argument into a repeatable defense/demo flow.
It is meant for adviser review, proposal defense, final defense rehearsal, or a
recorded walkthrough.

The demo should show that the project:

- addresses Crisanto's "What should I do today?" planning problem
- remains traceable to the original WSIDT SRS
- implements the SRS baseline as a reliable task-management system of record
- demonstrates generative UI as safe just-in-time planner UI
- uses typed backend operations instead of unsafe direct database access
- produces privacy-preserving evaluation evidence

## Core Demo Claim

```text
The app is not just a todo list. It is a planner-first productivity tracker
that uses task data, energy, available time, and explanation signals to help
UPOU faculty and staff decide what to do today.
```

## Demo Length

Target: 12 to 15 minutes.

Suggested timing:

| Segment                             |           Time |
| ----------------------------------- | -------------: |
| Opening and study grounding         |      2 minutes |
| SRS reconciliation                  |      2 minutes |
| Architecture and Gen UI explanation |      2 minutes |
| Live `/today` planner demo          |      5 minutes |
| Evaluation and privacy              |      2 minutes |
| Limitations and future work         | 1 to 2 minutes |

## Pre-Demo Setup

Use the real-backend demo when possible because it exercises Django, Vite,
database persistence, planner actions, and feedback submission.

From `ui/`:

```text
npm run test:e2e:planner-real
```

This validates the demo path before presenting. It is demo evidence, not
participant evaluation evidence.

For a seeded manual demo, from `api/`:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset
```

For seeded sample admin metrics:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset --include-outcomes
```

Before presenting:

- confirm backend and frontend are running
- confirm the seeded user can open `/today`
- confirm planner suggestions appear
- confirm suggestion reasons expand
- confirm feedback can be submitted
- keep `CAPSTONE_ARGUMENT.md` and `SRS_TRACEABILITY_MATRIX.md` ready as backup
- keep `CAPSTONE_DEMO_RUN.md` ready if the live browser demo fails

Seeded demo credentials:

```text
Username: planner-demo
Password: planner-demo-password
```

## Opening Script

Say:

```text
This project is grounded in Crisanto's study, "What should I do today?", which
looked at planning and productivity-tracking needs among UPOU employees. The
important product question is not only "What tasks do I have?" but "Given my
tasks, deadlines, energy, and available time, what should I do today?"
```

Then say:

```text
My original SRS described WSIDT as a broad task-management and
productivity-tracking application. During implementation, I preserved that
baseline, but I narrowed the capstone contribution around the SRS feature most
connected to the study: suggested tasks.
```

## Step 1: Show SRS Traceability

Open:

```text
SRS_TRACEABILITY_MATRIX.md
```

Show these rows:

- `F-11 Task configuration`
- `F-12 Suggested tasks`
- `F-21 Personal scheduling`
- `F-41 Productivity report with analytics`
- `F-42 Energy tracking`
- `F-53 Google Calendar integration`
- `Voice/conversational interface note`

Say:

```text
This matrix is how I reconcile the original SRS with the current implementation.
Task management is implemented as the system of record. Suggested tasks,
personal scheduling, productivity analytics, and energy tracking are
reinterpreted around the planner-first `/today` workflow. Optional integrations
such as Google Calendar and full voice/chat are deferred.
```

Key point:

```text
The project does not abandon the SRS. It uses the SRS as the product baseline
and focuses the capstone contribution on the planner.
```

## Step 2: Explain Architecture

Show:

- `api/upoutodo/models/planner.py`
- `api/upoutodo/views/planner.py`
- `ui/src/modules/planner/uiSchema.ts`
- `ui/src/modules/planner/registry.tsx`

Say:

```text
Django remains the system of record. It owns state, permissions, validation,
and privacy boundaries. React renders the planner UI. The planner layer exposes
typed operations such as get today's plan, submit check-in, accept suggestion,
snooze suggestion, dismiss suggestion, and submit feedback.
```

Then say:

```text
Generative UI here does not mean generating arbitrary JSX or letting an LLM
modify the database. It means the system chooses from registered planner
components based on the user's context, then calls typed backend operations.
```

Key point:

```text
The assistant or planner can choose the UI surface, but Django still validates
every state-changing action.
```

## Step 3: Live `/today` Planner Demo

Open the app as the seeded demo user and go to:

```text
/today
```

### 3.1 Show The Planner-First Surface

Point out:

- energy check-in
- available minutes
- focus mode
- suggested tasks
- reason/explanation controls
- feedback card
- normal task list below the planner

Say:

```text
The old todo-style question is "What tasks do I have?" This screen starts with
the planner question instead. It asks for the user's current planning context
before asking them to scan the full task list.
```

### 3.2 Submit A Check-In

Use a low-energy or limited-time scenario:

```text
Energy: low
Available minutes: 75 or 90
Focus mode: light work or flexible
Context: Preparing for meetings; prefer realistic next actions.
```

Say:

```text
The check-in makes energy and available time explicit planning inputs. This is
where the SRS's energy-tracking requirement becomes useful for planning rather
than just reporting.
```

### 3.3 Inspect Suggestions

Show the suggested tasks and their ordering.

Say:

```text
The suggestions are grounded in existing task data. The planner considers due
status, priority, recurrence, estimated effort, project context, and prior
snooze or dismiss history.
```

Point out the current planner mode chip and mode highlights:

- `Low energy` / `Energy low`
- `Time boxed` / available minutes and number of fitting tasks
- `Triage` / overdue count

### 3.4 Open A Suggestion Reason

Expand the reason/details for one suggestion.

Point out:

- immediate relevance
- planner rationale
- task signals
- due status
- priority
- effort estimate
- score/history if visible

Say:

```text
The goal is not only to recommend a task, but to make the recommendation
understandable. That matters for trust and evaluation.
```

### 3.5 Act On Suggestions

Perform three actions:

- accept one suggestion
- snooze one suggestion
- dismiss one suggestion
- point out the visible confirmation messages after each action

Say:

```text
These actions are typed planner operations. The UI does not directly edit the
database. It calls specific backend endpoints, and the backend verifies the
user owns the plan item before changing state.
```

Then say:

```text
The confirmation messages also make the evaluation trail visible. They show
that accepted, snoozed, and dismissed suggestions are being captured as planner
signals, not as generic todo edits.
```

### 3.6 Submit Feedback

Submit:

```text
Helpfulness: 4
Confidence: 4
Note: The plan narrowed the next step and explained why.
```

Say:

```text
This feedback supports the capstone evaluation. The important measures are
whether the plan was helpful, whether confidence increased, and whether users
acted on suggestions.
```

## Step 4: Show Gen UI Modes

Show or explain the implemented just-in-time modes:

- low-energy plan: keeps urgent work visible while favoring smaller next
  actions
- limited-time plan: shows tasks that fit the available minutes, or the shortest
  next action when nothing fully fits
- overdue triage: narrows the planner surface to overdue suggestions
- unavailable planner state: shows a safe fallback when the planner request
  fails

Say:

```text
This is the just-in-time UI idea. The interface changes based on the planning
situation. Low energy, limited time, and too many overdue tasks should not all
produce the same static task list.
```

Then say:

```text
The system is not generating arbitrary UI code. It is generating a structured
UI decision: which registered planner mode to show, which suggestion ids belong
in the shortlist, and which typed actions are allowed.
```

If live mode switching is awkward, show:

```text
ui/src/modules/planner/uiSchema.ts
ui/src/modules/planner/__tests__/uiSchema.test.ts
```

Say:

```text
The schema tests show low-energy, limited-time, and overdue-triage behavior.
This keeps Gen UI controlled and testable.
```

## Step 5: Evaluation And Privacy

Open:

```text
CAPSTONE_EVALUATION_METHOD.md
```

Show the evaluation questions and in-app measures.

If sample metrics are seeded, show the admin Planner Evaluation dashboard or
reference:

```text
GET /api/planner/evaluation/
```

In the admin dashboard, point out:

- the aggregate-only privacy notice
- adoption and feedback response metrics
- helpfulness and confidence metrics
- suggestion action signals
- evidence labels under each metric

Say:

```text
The evaluation is aligned with the claim. I am not trying to prove the app
replaces commercial productivity tools. I am evaluating whether the planner
helps users choose a next task, understand why it was suggested, and feel more
confident about what to do today.
```

Then say:

```text
Reporting is aggregate and privacy-preserving. The admin evaluation summary
does not need to expose task titles, descriptions, user emails, or raw feedback
notes.
```

## Step 6: Close With Limitations

Say:

```text
This is still an MVP. The scoring logic is deterministic and explainable, not a
final recommendation engine. Google Calendar sync is deferred. Full chat,
voice, or MCP integration is also deferred, but the typed operations prepare
the architecture for those future interfaces. Student use cases are adjacent or
future scope because Crisanto's source study focused on UPOU employees.
```

Then close:

```text
The contribution is the planner-first reinterpretation of the SRS. The app
keeps task management as the backend foundation, and uses generative,
just-in-time UI to help faculty and staff answer "What should I do today?"
```

## Expected Questions And Answers

### Is this still aligned with the original SRS?

Yes. The traceability matrix shows that the task-management and
productivity-tracking baseline is implemented or intentionally deferred by
priority. The capstone contribution focuses on the SRS's suggested-tasks,
energy-tracking, personal-scheduling, and productivity-analytics requirements.

### Why not use Google Calendar as the backend?

Google Calendar is better treated as a scheduling or sync destination. The app
needs its own backend for task ownership, validation, planner feedback,
recommendation state, suggestion actions, auditability, and privacy boundaries.

### Is this really generative UI?

Yes, but in a controlled form. The system generates a UI decision, not arbitrary
runtime code. It selects from registered React components using planner state
and task signals.

### Why not build chat first?

Chat without typed operations would be risky and hard to evaluate. The current
planner endpoints create the safe action layer that future chat, MCP, or voice
interfaces can call.

### How will success be measured?

Through a walkthrough focused on helpfulness, confidence, explanation quality,
and suggestion actions. The system records aggregate planner metrics and avoids
reporting individual task content.

### What is the role of Codex in the study?

Codex is documented as an AI-assisted development tool. It supported code
review, implementation, tests, and documentation. The developer retained
decision authority over requirements, scope, and accepted changes.

## Fallback If Live Demo Fails

Use these artifacts:

- `CAPSTONE_DEMO_RUN.md`: recorded successful fixture-backed and real-backend
  Playwright walkthroughs
- `CAPSTONE_ARGUMENT.md`: paper/defense narrative
- `SRS_TRACEABILITY_MATRIX.md`: SRS-to-implementation mapping
- `JIT_PLANNER_UI_SPEC.md`: Gen UI and component registry design
- `CAPSTONE_EVALUATION_METHOD.md`: evaluation plan and privacy boundaries

Say:

```text
The live environment is not cooperating, so I will use the recorded Playwright
demo evidence and source artifacts. The real-backend Playwright run validates
the same walkthrough against Django, Vite, database persistence, planner
actions, and feedback submission.
```

## Demo Evidence Checklist

Before a defense or recording, confirm that at least one of these is available:

- latest `npm run test:e2e:planner-real` result
- latest `npm run test:e2e:planner-demo` result
- screenshot from `ui/test-results/`
- seeded demo account
- traceability matrix
- capstone argument document
- evaluation method document

## Short Version

If time is limited, use this four-part flow:

1. Show `SRS_TRACEABILITY_MATRIX.md`: the SRS baseline is preserved.
2. Show `/today`: the planner asks for energy/time and recommends tasks.
3. Show a reason panel: suggestions are explainable and grounded in task data.
4. Show feedback/evaluation: success is measured through helpfulness,
   confidence, action rates, and privacy-preserving aggregate metrics.
