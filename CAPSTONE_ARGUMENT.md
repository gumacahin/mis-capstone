# Capstone Argument

Date: 2026-06-28

## One-Sentence Claim

This capstone implements the original WSIDT SRS as a planner-first prototype
and argues that generative, just-in-time UI is the key interaction strategy for
helping UPOU faculty and staff answer Crisanto's daily planning question:
"What should I do today?"

## Thesis

The original SRS proposed a web-based task-management and productivity-tracking
application for the UPOU community. That scope is broad: tasks, projects,
labels, scheduling, reminders, reports, energy tracking, integrations, and
administrative insights.

The current implementation does not abandon that SRS. It preserves the generic
task-management layer as a reliable system of record, then focuses the capstone
contribution on the SRS feature with the strongest connection to Crisanto's
study: suggested tasks.

The project thesis is:

```text
A planner-first productivity tracker can better address the "What should I do
today?" problem when it uses task data, due dates, priority, recurrence, energy,
available time, and user feedback to generate a just-in-time planning interface
instead of showing only a static task list.
```

## Argument Structure

### 1. Crisanto Provides The Requirements Grounding

Crisanto's study is the source-study basis for the capstone. It identified a
need for a web-based planner and productivity tracker for UPOU employees,
including faculty, research assistants, and staff.

The study also motivates the project's central planning question:

```text
What should I do today?
```

This matters because the problem is not simply storing tasks. The problem is
helping users decide what work deserves attention now.

### 2. The Original SRS Defines The Product Baseline

The original ReadySET SRS defines WSIDT as a task-management and
productivity-tracking application. Its Release 1.0 and desired features include:

- user registration and site configuration
- task configuration
- personal scheduling
- reminders and notifications
- suggested tasks
- productivity reports and analytics
- device syncing
- admin area
- energy tracking
- application integration

The SRS also notes a voice/conversational interface direction.

This capstone should be judged against that baseline, but not forced to
complete every optional/later feature.

### 3. The Implementation Satisfies The Baseline As A System Of Record

The current Django/React implementation supports the task-management foundation:

- Django/DRF owns state, permissions, validation, and audit-friendly
  transitions.
- React provides pages for task, project, label, inbox, upcoming, today,
  productivity, settings, and admin workflows.
- Tasks support projects, sections, tags, due dates, priority, recurrence,
  completion, ordering, comments, notifications, and email digest behavior.
- Security fixes protect profile updates, cross-user task mutation, comments,
  daily digest triggering, and admin/reporting boundaries.

This means the app does not need to keep expanding generic todo features to
support the capstone. The baseline exists to provide trustworthy task data for
planning.

### 4. The Capstone Contribution Is Planner-First Reinterpretation

The strongest SRS item is `F-12 Suggested tasks`.

The current implementation expands that feature into a planner-first workflow:

- `EnergyCheckIn` captures energy, available time, focus mode, and context.
- `TodayPlan` represents a generated daily plan.
- `PlanItem` represents ordered suggestions with reasons, estimated minutes,
  scores, and action state.
- Planner endpoints expose typed operations for today, check-in, rebuild,
  accept, snooze, dismiss, feedback, and aggregate evaluation.
- `/today` shows the planner check-in and recommended tasks before the normal
  task list.

This turns the product from:

```text
What tasks do I have?
```

into:

```text
Given my tasks, deadlines, energy, and available time, what should I do today?
```

### 5. Gen UI Is The Interaction Strategy

The original SRS does not explicitly say "generative UI." The capstone's claim
is that generative UI is the design strategy that makes the planning
requirements useful.

In this project, generative UI means:

- the system chooses the planning surface needed for the user's situation
- React renders only registered planner components
- the assistant or planner layer does not generate arbitrary frontend code
- all state changes go through typed backend operations
- Django remains responsible for validation, ownership, permissions, and
  privacy

The current just-in-time UI modes are:

- default daily plan
- low-energy plan
- limited-time plan
- overdue triage
- unavailable planner state

This is safer and more defensible than allowing an LLM to directly mutate the
database or generate arbitrary executable UI.

### 6. Evaluation Measures The Planning Claim

The evaluation should not try to prove that WSIDT is a full replacement for
Todoist, Trello, Google Calendar, or paper planning.

It should evaluate whether the planner-first prototype helps UPOU faculty and
staff:

- choose what to work on next
- understand why a task was suggested
- feel that the plan fits their energy and available time
- act on suggestions by accepting, snoozing, or dismissing
- report increased confidence in what to do today

The implementation supports this through:

- planner feedback ratings
- suggestion action status
- aggregate evaluation metrics
- privacy-preserving admin summaries
- Playwright demo and real-backend walkthroughs

## What To Claim

Claim:

```text
The project implements a planner-first MVP grounded in the original SRS and
Crisanto's study. It demonstrates that generative, just-in-time UI can turn
stored task data into contextual daily planning support.
```

Claim:

```text
The existing todo backend is intentionally treated as a minimal system of
record. The capstone contribution is not another generic todo clone, but an
adaptive daily planning layer.
```

Claim:

```text
Typed operations make future chat, MCP, or voice interfaces safer because the
assistant can only call predefined backend actions with validated inputs.
```

## What Not To Overclaim

Do not claim:

- that Gen UI was explicitly required by the original SRS
- that the planner proves productivity improvement at organizational scale
- that the app replaces Google Calendar or commercial task managers
- that the current scoring algorithm is final or intelligent enough for all
  users
- that students were validated by Crisanto's original study
- that admin analytics should expose individual task content
- that voice/chat/MCP is already implemented

## Paper Chapter Fit

| Paper section    | Argument to use                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Introduction     | UPOU faculty/staff need planning support, not just task storage.                                                             |
| Background       | Crisanto provides the requirements grounding and planning problem.                                                           |
| SRS/Requirements | The original WSIDT SRS defines the broad product baseline.                                                                   |
| Design           | Django is the system of record; React renders planner-first and JIT UI; future assistants use typed operations.              |
| Implementation   | Planner models, endpoints, UI schema, component registry, `/today`, feedback, and evaluation metrics.                        |
| Evaluation       | Walkthrough asks whether users can decide what to do next and understand why.                                                |
| Discussion       | Gen UI helps adapt the interface to context, but the current system is still an MVP.                                         |
| Limitations      | Small sample, deterministic scoring, no full Google Calendar sync, no runtime chat/voice, students outside validation scope. |

## Defense Talking Points

- The SRS baseline is still present; the traceability matrix shows what is
  implemented, reinterpreted, and deferred.
- The capstone intentionally stops expanding generic task-management features
  because that would recreate existing tools.
- The strongest SRS feature is suggested tasks, which becomes the planner-first
  `/today` workflow.
- Gen UI is used in a controlled way: generated UI decisions, not generated
  executable code.
- The backend remains authoritative, so the design is safer than letting an LLM
  directly access the database.
- Evaluation is aligned with the actual claim: helpfulness, confidence,
  explanation quality, and action on suggestions.

## Short Defense Version

```text
My original SRS described a broad task-management and productivity-tracking
system. During implementation, I preserved that baseline but narrowed the
capstone contribution around the most important planning requirement: suggested
tasks. The result is a planner-first `/today` flow that asks for energy,
available time, and focus mode, then produces explainable recommendations from
the user's real task data. I use generative UI in a controlled way: the system
selects from registered planner components and calls typed backend operations,
while Django remains the system of record. This lets the project address
Crisanto's "What should I do today?" problem without turning the prototype into
another generic todo app or giving an assistant unsafe database access.
```
