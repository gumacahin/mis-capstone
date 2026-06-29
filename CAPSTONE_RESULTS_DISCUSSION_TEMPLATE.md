# Capstone Results And Discussion Template

## Purpose

Use this document when drafting the Results, Discussion, Limitations, and Future
Work portions of the capstone paper.

This template is intentionally evidence-aware. It should not be filled with
invented findings. Replace placeholders only after a real adviser review,
pilot walkthrough, or participant walkthrough has been recorded in
`CAPSTONE_EVALUATION_RESULTS.md`.

## Evidence Boundary

Use these labels consistently:

- **Implementation evidence**: code, models, endpoints, UI, tests, and
  documentation that show what was built.
- **Automated demo evidence**: Playwright or local demo runs that show the
  system works on seeded data.
- **Adviser-review evidence**: feedback from an adviser or evaluator reviewing
  the prototype.
- **Pilot evidence**: informal walkthrough feedback from a non-target or
  convenience participant.
- **Participant evidence**: walkthrough feedback from UPOU faculty or staff,
  matching the source-study scope.

The paper can use implementation and automated demo evidence to support
readiness and technical correctness. It should use adviser, pilot, or
participant evidence to discuss perceived usefulness, clarity, and workflow fit.

## Results Section Draft

### Results Overview

```text
The evaluation examined whether the planner-first prototype helped users answer
the daily planning question, "What should I do today?" The evaluation focused
on the Today planner, which combines task data, energy level, available time,
focus mode, suggestion reasons, planner actions, feedback ratings, and a
deterministic planner assistant panel that invokes typed backend operations.
```

Add after results exist:

```text
The evaluation included [N] session(s): [participant/adviser/pilot/demo
breakdown]. The session data were recorded using the capstone evaluation packet
and summarized in the evaluation results log.
```

### Implementation Results

Use this section for what the system can demonstrably do.

```text
The implementation preserves the original SRS task-management baseline through
a Django REST backend and React frontend, then adds planner-specific support for
daily decision making. The backend includes EnergyCheckIn, TodayPlan, PlanItem,
TodayPlanFeedback, planner evaluation summaries, and a typed planner tool layer.
The frontend makes /today planner-first by showing a check-in, suggested tasks,
suggestion reasons, just-in-time planner modes, planner feedback, and a
deterministic assistant panel.
```

Mention verified capabilities:

- task system remains the system of record
- `/today` planner dashboard
- low-energy, limited-time, overdue-triage, and unavailable planner modes
- suggestion reason and task-signal display
- accept, snooze, dismiss, rebuild, check-in, and feedback operations
- planner assistant typed-tool catalog and invocation
- aggregate admin evaluation summary
- privacy-preserving reporting boundary

### Automated Demo Results

Use this section for Playwright and test evidence.

```text
Automated verification showed that the main planner flow works on seeded data.
The backend test suite, frontend build and lint checks, fixture-backed
Playwright planner demo, and real-backend Playwright demo passed during the
latest rehearsal. These results show implementation readiness, but they do not
replace participant evidence.
```

Fill with latest known values:

```text
Backend tests: [N passed, warnings]
Frontend build/lint: [passed/failed]
Today page e2e: [N passed]
Fixture-backed planner demo: [N passed]
Real-backend planner demo: [N passed]
```

### Walkthrough Results

Use this section only after a real session exists.

```text
Across [N] recorded walkthrough session(s), [summary of whether users could
choose a next task]. Helpfulness ratings averaged [value], and confidence
ratings averaged [value]. Participants accepted [count] suggestion(s), snoozed
[count], and dismissed [count]. [N] participant(s) inspected a suggestion
reason, and [N] used the planner assistant panel.
```

Use cautious language:

```text
These results suggest [strong/mixed/weak] formative support for the claim that
the planner helps users decide what to do next.
```

Do not write:

```text
The system proves productivity improvement.
```

Do write:

```text
The walkthrough evidence suggests that participants could use the planner to
select a next task and understand why the task was recommended.
```

### Qualitative Themes

Use anonymized themes only.

Possible theme headings:

- Clarity of next action
- Trust in suggestion reasons
- Fit with energy and available time
- Usefulness of just-in-time planner modes
- Understanding of typed assistant actions
- Missing context or expected integrations
- Privacy and comfort with reporting

Template:

```text
The strongest positive theme was [theme]. Participants or reviewers noted that
[anonymized paraphrase]. The main friction point was [theme], especially when
[anonymized paraphrase]. These observations indicate that the planner's
decision-support value depends on both task quality and the clarity of the
recommendation explanation.
```

## Discussion Section Draft

### Reconnecting To Crisanto's Study

```text
Crisanto's study motivated a planning and productivity-tracking system for UPOU
employees and foregrounded the practical question, "What should I do today?"
The prototype addresses this question by treating stored task data as the
foundation for a daily planning layer, rather than treating task storage as the
main contribution.
```

### Reconnecting To The Original SRS

```text
The original SRS described a broad task-management and productivity-tracking
tool. The implementation preserves that baseline through projects, sections,
tasks, tags, recurrence, notifications, reporting, admin support, and a Django
REST API. The capstone contribution reinterprets the suggested-tasks and
energy-tracking requirements as a planner-first Today experience.
```

### Why Gen UI Matters Here

```text
The project uses generative UI in a controlled form. The system generates a
structured UI decision, such as low-energy mode, limited-time mode, or overdue
triage, but React renders only registered components. This makes the interface
adaptive without allowing arbitrary generated frontend code.
```

### Why Typed Operations Matter

```text
Typed operations are the safety boundary for future assistant, chat, MCP, or
voice interfaces. The planner assistant can discover and call predefined
operations, but Django still owns permissions, validation, object ownership, and
state changes. This prevents the assistant layer from becoming raw database
access.
```

### What The Findings Mean

Use after walkthrough data exists:

```text
The findings indicate that [interpretation]. This supports the narrower
capstone claim that a planner-first, just-in-time interface can help users
select and understand a next task. The findings do not establish organization-
wide productivity gains, and they should be interpreted as formative evidence
from a small capstone study.
```

## Limitations Section Draft

Use these limitations as applicable:

- The evaluation sample is small.
- The primary validated scope is UPOU faculty and staff; students remain future
  or adjacent scope.
- The planner scoring logic is deterministic and explainable, but not a final
  recommendation engine.
- Google Calendar sync is deferred.
- Full natural-language chat, voice, or MCP integration is deferred.
- The planner depends on task data quality.
- Automated Playwright runs are demo evidence, not participant evidence.
- The evaluation measures perceived usefulness, confidence, and action signals,
  not long-term productivity improvement.

Suggested paragraph:

```text
This capstone should be interpreted as an MVP and formative evaluation. The
sample size is limited, the recommendation logic is deterministic, and the
system does not yet include Google Calendar synchronization or a full
conversational interface. The results therefore support claims about planner
readiness, explanation clarity, and perceived usefulness, but not broad claims
about long-term productivity improvement.
```

## Future Work Section Draft

Prioritized future work:

1. Conduct additional walkthroughs with UPOU faculty and staff.
2. Improve task estimation and task-signal quality.
3. Add opt-in Google Calendar context as scheduling input, not as the primary
   todo backend.
4. Add a constrained chat shell that calls the existing typed planner tools.
5. Explore MCP-style tool exposure for the same planner operations.
6. Add longitudinal evaluation after users interact with the planner over
   multiple days.
7. Revisit student use cases only after separating them from the faculty/staff
   validation scope.

Suggested paragraph:

```text
Future work should extend the planner without expanding into generic task-app
features for their own sake. The most direct next step is to test the existing
planner with more faculty and staff users, then improve recommendation signals
based on observed friction. Calendar integration and chat should be added only
through typed operations so the backend remains the source of truth.
```

## Conclusion Section Draft

```text
The capstone demonstrates a planner-first reinterpretation of the WSIDT SRS.
Instead of treating the application as another task manager, the implementation
uses Django as a system of record and React as a just-in-time planner interface
for answering "What should I do today?" The controlled Gen UI approach is the
key contribution: the system adapts the visible planning surface to energy,
time, urgency, and task signals while preserving backend validation through
typed operations. This provides a defensible path from the original SRS to a
focused daily planning prototype for UPOU faculty and staff.
```

## Before Submitting The Paper

Check these before finalizing Results and Discussion:

- `CAPSTONE_EVALUATION_RESULTS.md` contains only real recorded sessions or
  clearly labeled demo entries.
- Seeded demo evidence is not described as participant evidence.
- Quotes or qualitative notes are anonymized and paraphrased.
- Task titles, course names, student names, and email addresses are removed.
- Claims stay narrow: decision support, explanation quality, confidence, and
  formative usefulness.
- Limitations clearly state what is not implemented or not validated.
