# Capstone Evaluation Results Log

## Purpose

This file records actual adviser review, pilot walkthrough, or participant
evaluation sessions for the planner-first capstone project.

Use this log after running `CAPSTONE_EVALUATION_PACKET.md`. Do not use this file
to invent or simulate participant results. Automated Playwright runs and seeded
demo runs belong in `CAPSTONE_REHEARSAL_NOTES.md` or `CAPSTONE_DEMO_RUN.md`.

## Evidence Categories

Use one of these labels for every entry:

- `participant`: UPOU faculty or staff user completing the walkthrough.
- `adviser-review`: adviser or evaluator review of the walkthrough.
- `pilot`: informal pilot with a non-target or convenience participant.
- `demo`: developer-run or seeded-data demonstration.

Only `participant` entries should be treated as participant evidence in the
paper. `adviser-review`, `pilot`, and `demo` entries can support formative
discussion, limitations, and readiness claims.

## Privacy Rules

- Use session IDs instead of names.
- Do not record private task titles, course names, student names, project
  names, email addresses, or raw identifying notes.
- Paraphrase qualitative comments before adding them here.
- Keep seeded demo data separate from participant evidence.
- Report aggregate findings where possible.

## Current Status

No real adviser, pilot, or participant walkthrough results have been recorded
yet.

The implementation currently has automated demo-readiness evidence in:

- `CAPSTONE_REHEARSAL_NOTES.md`
- `CAPSTONE_DEMO_RUN.md`

## Session Register

| Session ID  | Date | Evidence Category                    | Participant Group | Dataset                                                 | Status      | Privacy Review |
| ----------- | ---- | ------------------------------------ | ----------------- | ------------------------------------------------------- | ----------- | -------------- |
| pending-001 | TBD  | adviser-review / pilot / participant | TBD               | seeded demo / participant account / anonymized task set | Not started | Not started    |

## Result Entry Template

Copy this section for each completed walkthrough.

```text
Session ID:
Date:
Evidence category: participant / adviser-review / pilot / demo
Participant group: faculty / staff / adviser / demo / other
Dataset: seeded demo / participant account / anonymized task set
Environment: local demo / deployed app / screen-share / in-person

Completed check-in: yes / no
Inspected suggestion reason: yes / no
Accepted suggestion: yes / no
Snoozed suggestion: yes / no
Dismissed suggestion: yes / no
Used planner assistant panel: yes / no
Submitted feedback: yes / no

Helpfulness rating:
Confidence rating:

Post-task ratings:
- Planner helped choose what to work on next:
- Suggested task order made sense:
- Suggestion reason was understandable:
- Check-in made plan more relevant:
- Planner reduced decision effort:
- Confidence after using planner:
- Would consider daily workflow use:
- Planner assistant typed actions were understandable:

Could explain recommendation: yes / partial / no
Next task was clear: yes / partial / no
Typed-operation idea was clear: yes / partial / no

Non-identifying observation summary:

Post-task answer summary:

Privacy review:
- Task titles removed: yes / no
- Names and email addresses removed: yes / no
- Course or student identifiers removed: yes / no
- Free-form notes paraphrased: yes / no
- Seeded demo data separated from participant evidence: yes / no
- Only aggregate metrics reported: yes / no

Interpretation:
Strong signal / mixed signal / weak signal

Follow-up actions:
```

## Aggregate Summary

Update this only after one or more completed entries.

```text
Total completed sessions:
Participant sessions:
Adviser-review sessions:
Pilot sessions:
Demo sessions:

Average helpfulness rating:
Average confidence rating:
Accepted suggestion count:
Snoozed suggestion count:
Dismissed suggestion count:
Planner assistant used count:

Common positive signals:

Common friction points:

Privacy notes:
```

## Paper-Ready Results Paragraph Template

Use this only after results exist.

```text
The walkthrough evaluation included [N] session(s): [participant/adviser/pilot
breakdown]. Participants used the Today planner to complete a check-in, review
suggested tasks, inspect at least one recommendation reason, act on a
suggestion, use the planner assistant's typed-operation panel, and submit
helpfulness and confidence feedback. The results showed [summary of
helpfulness/confidence/action signals]. Qualitative notes suggested that
[anonymized theme]. No private task titles, user identifiers, or raw
identifiable feedback notes were included in the report.
```
