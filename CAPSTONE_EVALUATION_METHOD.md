# Capstone Evaluation Method

## Purpose

This method evaluates whether the planner-first implementation helps UPOU
faculty and staff answer the daily planning question from Crisanto's study:
"What should I do today?"

The evaluation is focused on decision support, explanation quality, and trust in
the generated daily plan. It does not try to prove that the application is a
complete replacement for Todoist, Trello, Google Calendar, or paper planning
methods.

## Relationship To The Source Study

Crisanto's paper provides the requirements grounding for a web-based planner and
productivity tracker for UPOU employees, specifically faculty, research
assistants, and staff. This capstone uses that scope as the primary validation
boundary.

The implementation should therefore be described as a planner-first prototype
for UPOU faculty and staff. Student use cases may be mentioned as adjacent or
future work, but they should not be presented as the main validated user group
for this version.

## Evaluation Questions

1. Does the `/today` planner help users choose what to work on next?
2. Do users understand why a task was suggested?
3. Does the energy, available-time, and focus-mode check-in make suggestions
   feel better matched to the user's current situation?
4. Do users engage with planner actions such as accept, snooze, dismiss, and
   feedback submission?
5. Can the system produce useful evaluation evidence without exposing task
   content, usernames, email addresses, or individual feedback notes?

## Participant Scope

Primary participants should be UPOU faculty and staff, matching the source
study's institutional and work-context scope.

If students are discussed in the paper, they should be framed as a possible
future extension or secondary audience. The current evaluation should avoid
claiming that student planning needs were validated by the source study.

Suggested wording:

```text
This evaluation focuses on UPOU faculty and staff because the source study used
for requirements grounding examined planning and productivity practices among
UPOU employees. Although the initial project proposal considered students as a
possible audience, student use cases are treated as future or adjacent work for
this implementation.
```

## Evaluation Procedure

1. Give the participant a short orientation to the planner-first goal.
2. Ask the participant to use existing tasks or a seeded task set with due
   dates, priorities, estimates, and project or section context.
3. Ask the participant to open `/today`.
4. Ask the participant to complete the planner check-in:
   energy level, available minutes, focus mode, and optional context.
5. Ask the participant to review the suggested tasks and inspect the reason for
   at least one suggestion.
6. Ask the participant to act on suggestions by accepting, snoozing, or
   dismissing items.
7. Ask the participant to submit plan feedback using helpfulness, confidence,
   and an optional note.
8. Review only aggregate evaluation metrics through the admin dashboard or the
   admin-only planner evaluation endpoint.

## Seeded Walkthrough Dataset

For repeatable local demos, screenshots, or pilot walkthroughs, seed the demo
dataset from the `api/` directory:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset
```

This creates a `planner-demo` user, a `Capstone Evaluation Demo` project,
faculty/staff-oriented tasks, a low-energy check-in, and a generated today
plan. To also populate sample suggestion actions and plan feedback for the
aggregate admin dashboard, run:

```text
DEBUG=True uv run python manage.py seed_planner_evaluation_demo --reset --include-outcomes
```

The seeded data is for demonstration and pilot testing only. Actual study
results should come from participant walkthroughs or clearly labeled observed
evaluation sessions.

The step-by-step moderator protocol is captured in
`CAPSTONE_EVALUATION_WALKTHROUGH.md`.

The field-ready participant/adviser packet is captured in
`CAPSTONE_EVALUATION_PACKET.md`. Use it when you need a task sheet, observation
sheet, post-task rating form, and privacy review checklist for an actual
session.

Completed adviser, pilot, or participant sessions should be recorded in
`CAPSTONE_EVALUATION_RESULTS.md`. Keep automated demo runs separate from that
results log unless they are explicitly labeled as `demo` evidence.

## In-App Measures

The current implementation can support these quantitative measures:

- total daily plans generated
- feedback count
- feedback response rate
- average helpfulness rating
- average confidence rating
- total suggestion count
- accepted suggestion rate
- snoozed suggestion rate
- dismissed suggestion rate

These measures are available through the admin-only
`GET /api/planner/evaluation/` typed operation and the Planner Evaluation
section of the admin dashboard.

In this context, a typed operation means an explicit backend action with named
inputs, validation, permissions, and predictable side effects. The evaluation
uses these operations instead of giving any chat or assistant layer direct
database access.

## Qualitative Measures

The evaluation can also use short qualitative prompts after the task:

```text
What made the suggested plan useful or not useful?
Was the reason for the recommended task understandable?
Did the check-in change how well the plan matched your current situation?
What information was missing when deciding what to do next?
Would you use this planner as part of your daily workflow? Why or why not?
```

Optional free-form feedback notes can support analysis, but they should be
handled carefully. Notes should be anonymized or paraphrased before being used
in the paper.

## Privacy And Data Handling

The evaluation should report aggregate planner outcomes instead of individual
task content.

Do not include these fields in capstone reporting:

- task titles
- task descriptions
- user names
- email addresses
- individual comments
- raw free-form feedback notes tied to a participant

Acceptable paper evidence includes aggregate metrics such as helpfulness,
confidence, feedback response rate, and accepted or snoozed suggestion rates.
If qualitative quotes are used, they should be anonymized and stripped of
identifying task details.

## Success Criteria

The planner-first implementation is successful for the capstone if it provides
evidence that:

- users can identify a next task from `/today`
- users can explain why a suggestion appeared
- users perceive the plan as helpful
- users report increased confidence about what to do next
- users interact with planner actions instead of ignoring the generated plan
- evaluation reporting remains aggregate and privacy-preserving

A practical interpretation for a small capstone study:

```text
A mean helpfulness or confidence score near 4 out of 5 is a strong positive
signal. A score near 3 suggests mixed usefulness and should be discussed with
qualitative feedback. A score below 3 indicates that the planner needs more
work before it can support the daily planning claim.
```

## Current Implementation Support

The current project supports this method through:

- `/today` planner dashboard
- `EnergyCheckIn` for energy, available time, focus mode, and context
- `TodayPlan` for the generated daily plan
- `PlanItem` for ordered suggestions, reasons, task signals, and action status
- `TodayPlanFeedback` for helpfulness, confidence, and optional notes
- structured task signals for due status, priority, effort, recurrence,
  project or section context, score, and snooze or dismiss history
- typed planner operations for check-in, rebuild, accept, snooze, dismiss, and
  feedback submission
- planner assistant panel that demonstrates typed tool discovery and
  invocation without unrestricted database access
- admin-only aggregate planner evaluation summary
- admin dashboard Planner Evaluation section
- Playwright coverage for the visible `/today` planner flow

## Limitations

This evaluation has several expected limitations:

- The participant sample will likely be small because this is a capstone
  project.
- The planner scoring logic is deterministic and explainable, but still a
  minimum viable product (MVP).
- The study evaluates a planner-first prototype, not a full commercial
  productivity platform.
- Google Calendar synchronization is not part of the current evaluation slice.
- Students are not the primary validation group unless a separate student study
  is added.
- Codex-assisted development is a development artifact, not independent user
  validation.

## Paper-Ready Method Paragraph

```text
The evaluation focused on whether the planner-first prototype helped UPOU
faculty and staff decide what to work on next. Participants used the `/today`
planner, completed a short check-in for energy level, available time, and focus
mode, reviewed suggested tasks, inspected suggestion reasons, and acted on the
plan by accepting, snoozing, or dismissing items. Participants then submitted
brief feedback on plan helpfulness and confidence in deciding what to do next.
The system summarized evaluation data using aggregate metrics such as feedback
response rate, average helpfulness, average confidence, and suggestion action
rates. Individual task content, user identifiers, and raw feedback notes were
excluded from reporting to preserve privacy.
```

## Reference

Crisanto, `"What should I do today?" A Case Study on the Current Practices and
Software Requirements Specification of a Web-Based Planner and Productivity
Tracker`, IJITGEB: https://ijitgeb.org/ijitgeb/article/view/94/53
