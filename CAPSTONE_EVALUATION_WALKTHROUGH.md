# Capstone Evaluation Walkthrough Protocol

## Purpose

This protocol turns the evaluation method into a repeatable walkthrough for
adviser demos, pilot testing, screenshots, or a small capstone evaluation
session.

The walkthrough evaluates the planner-first question:

```text
Given my tasks, deadlines, energy, and available time, what should I do today?
```

It is not a test of every generic task-management feature in the application.

## Roles

- Moderator: the person guiding the walkthrough, taking notes, and making sure
  privacy boundaries are followed.
- Participant: the UPOU faculty or staff user trying the planner flow.
- Observer: optional; records behavior and comments without steering the user.

For a solo demo, the developer can act as both moderator and participant, but
that should be labeled as a demo, not participant evaluation evidence.

## Setup

From the `api/` directory, create a clean seeded walkthrough dataset:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset
```

Use this version for a live walkthrough where the participant will choose
planner actions and submit feedback.

For a dashboard-only demo that needs sample aggregate metrics, run:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset --include-outcomes
```

Seeded demo credentials:

```text
Username: planner-demo
Password: planner-demo-password
```

Before the walkthrough:

- Confirm the backend and frontend are running.
- Confirm the seeded user can access `/today`.
- Confirm `/today` shows planner check-in controls and suggested tasks.
- Prepare a note-taking sheet using the template in this document.
- Remind yourself not to record private task titles, email addresses, or user
  identifiers in evaluation notes.

## Automated Playwright Demo

The walkthrough can also be exercised through Playwright with fixture data that
mirrors the seeded demo scenario:

```text
CI=1 PLAYWRIGHT_PORT=3104 PORT=3104 PLAYWRIGHT_BASE_URL=http://localhost:3104 PATH=/Users/marcoenrico/.nvm/versions/node/v22.11.0/bin:$PATH /Users/marcoenrico/.nvm/versions/node/v22.11.0/bin/node node_modules/@playwright/test/cli.js test tests/e2e/planner-evaluation-demo.spec.ts --project=chromium
```

The latest automated demo run is recorded in `CAPSTONE_DEMO_RUN.md`.

The Playwright demo is useful for repeatable UI verification and screenshots.
It is not participant evidence and does not replace real walkthrough notes.

## Participant Scenario

Give the participant this short scenario:

```text
Imagine you are starting your workday with limited energy and about 90 minutes
available before meetings. You already have teaching, admin, and research tasks
in the planner. Use the Today page to decide what you should work on next.
```

If the participant is using their own account instead of the seeded demo data,
replace the scenario with:

```text
Use your current task list as you normally would at the start of the day. Treat
the Today page as a planning assistant that should help you decide what to work
on next.
```

## Moderator Script

Read this before the participant begins:

```text
This walkthrough is about the Today planner. I am interested in whether the
planner helps you decide what to work on next, whether the reasons are
understandable, and whether the check-in makes the suggestions feel appropriate
for your current situation. This is not a test of you. If something is unclear,
that is useful feedback about the system.
```

Then say:

```text
Please think aloud as you use the planner. Say what you expect, what seems
useful, what seems confusing, and what you would do next in a real workday.
```

## Walkthrough Tasks

Ask the participant to complete these tasks in order:

1. Open `/today`.
2. Review the visible task suggestions without clicking anything yet.
3. Complete or update the check-in:
   energy level, available minutes, focus mode, and optional context.
4. Re-read the suggested plan after the check-in.
5. Pick the suggestion that seems most appropriate to do next.
6. Open the reason or explanation for that suggestion.
7. Explain in their own words why the planner recommended it.
8. Accept one suggestion.
9. Snooze one suggestion if it is useful later, or dismiss one suggestion if it
   is not useful today.
10. Submit plan feedback:
    helpfulness rating, confidence rating, and optional note.
11. State whether they would use this planner as part of their daily workflow.

## Observation Checklist

Record observations without capturing private task content.

Use these prompts:

- Did the participant understand the purpose of `/today`?
- Did the participant know what to do first?
- Did the participant complete the check-in without help?
- Did the participant notice that suggestions had reasons?
- Could the participant explain why a suggested task appeared?
- Did the participant trust the suggested order?
- Did the participant accept, snooze, or dismiss suggestions naturally?
- Did the participant's confidence appear to increase, decrease, or stay the
  same?
- What information did the participant expect but not see?
- What wording or UI element caused hesitation?

Avoid recording:

- exact task titles from participant accounts
- names of people, courses, students, or private projects
- email addresses
- raw notes that identify a participant

## Post-Task Questions

Ask these after the walkthrough:

```text
What made the suggested plan useful or not useful?
Was the reason for the recommended task understandable?
Did the check-in change how well the plan matched your current situation?
What information was missing when deciding what to do next?
Would you use this planner as part of your daily workflow? Why or why not?
```

Optional follow-up:

```text
If the planner could connect to Google Calendar later, what calendar information
would be most useful for deciding what to do today?
```

## Recording Template

Use one row per walkthrough.

```text
Session ID:
Date:
Participant group: faculty / staff / demo / other
Dataset: seeded demo / participant account / anonymized task set

Completed check-in: yes / no
Inspected suggestion reason: yes / no
Accepted suggestion: yes / no
Snoozed suggestion: yes / no
Dismissed suggestion: yes / no
Submitted feedback: yes / no

Helpfulness rating:
Confidence rating:

Could explain recommendation: yes / partial / no
Next task was clear: yes / partial / no

Non-identifying observation notes:

Post-task answer summary:

Privacy review completed: yes / no
```

## Metric Review

After one or more walkthroughs, review aggregate metrics only:

- feedback response rate
- average helpfulness rating
- average confidence rating
- accepted suggestion rate
- snoozed suggestion rate
- dismissed suggestion rate

These can be viewed through the admin Planner Evaluation dashboard or the
admin-only `GET /api/planner/evaluation/` endpoint.

Do not report seeded demo metrics as participant findings. If seeded data is
used in a presentation, label it as demonstration data.

## Interpretation Guide

Use this guide when writing the capstone discussion:

- Strong signal: participants can identify a next task, explain the reason, and
  give helpfulness or confidence ratings near 4 out of 5.
- Mixed signal: participants can use the planner but need help interpreting
  reasons, or ratings cluster near 3 out of 5.
- Weak signal: participants ignore suggestions, cannot explain why tasks were
  recommended, or ratings fall below 3 out of 5.

Action rates should be interpreted carefully:

- accepted suggestions suggest the plan helped pick a next action
- snoozed suggestions may mean the task is relevant but mistimed
- dismissed suggestions may reveal poor ranking, missing context, or a task that
  does not belong in today's plan

## Privacy Rules

For capstone reporting:

- Use session IDs instead of names.
- Report aggregate metrics instead of individual task records.
- Paraphrase qualitative notes.
- Remove course names, student names, private project names, and deadlines that
  could identify a participant.
- Keep Codex-assisted development notes separate from participant evaluation
  notes.

## Paper-Ready Walkthrough Description

```text
The walkthrough asked participants to use the Today planner to decide what to
work on next. Participants completed a short check-in, reviewed suggested tasks,
inspected at least one suggestion reason, acted on the plan by accepting,
snoozing, or dismissing suggestions, and submitted helpfulness and confidence
feedback. The moderator recorded non-identifying observations about whether the
participant understood the recommendation and whether the next task was clear.
Results were interpreted using aggregate planner metrics and anonymized
qualitative summaries.
```
