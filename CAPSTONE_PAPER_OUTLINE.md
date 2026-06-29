# Capstone Paper Outline

## Purpose

This outline is the assembly map for writing the final capstone paper. It links
each paper section to the source artifact that already contains the strongest
material.

The first assembled draft is in `CAPSTONE_PAPER_DRAFT.md`.

Use this file to draft the paper without overclaiming. The project argument is
planner-first decision support for UPOU faculty and staff, not a claim that the
prototype is a complete commercial productivity platform.

## Working Title

```text
"What Should I Do Today?": A Planner-First Productivity Tracker Using
Just-in-Time UI and Typed Planner Operations
```

Alternative shorter title:

```text
A Planner-First Productivity Tracker for UPOU Faculty and Staff
```

## Core Thesis

Use this as the central claim:

```text
This capstone implements the original WSIDT SRS as a planner-first prototype.
It preserves task management as the system of record, then uses generative,
just-in-time UI and typed backend operations to help UPOU faculty and staff
decide what to work on today.
```

Primary source artifact:

- `CAPSTONE_ARGUMENT.md`

## Section Map

| Paper Section                       | Main Purpose                                                                                                              | Source Artifacts                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Introduction                        | Establish the daily planning problem and capstone claim.                                                                  | `CAPSTONE_ARGUMENT.md`, `CAPSTONE_NOTES.md`                                                            |
| Background And Related Work         | Explain Crisanto's study and the original methods/context without overstating scope.                                      | `CAPSTONE_NOTES.md`, `CAPSTONE_ARGUMENT.md`                                                            |
| Requirements And SRS Reconciliation | Show how the original ReadySET SRS is preserved, reinterpreted, or deferred.                                              | `SRS_TRACEABILITY_MATRIX.md`, `docs/srs.html`, `CAPSTONE_ARGUMENT.md`                                  |
| System Design                       | Explain Django as system of record, React as planner-first UI, typed operations, and controlled Gen UI.                   | `JIT_PLANNER_UI_SPEC.md`, `FREEZE_NOTES.md`, `CAPSTONE_NOTES.md`                                       |
| Implementation                      | Describe planner models, endpoints, UI modes, assistant panel, and evaluation metrics.                                    | `DEV_JOURNAL.md`, `JIT_PLANNER_UI_SPEC.md`, `CAPSTONE_REHEARSAL_NOTES.md`                              |
| Evaluation Method                   | Explain walkthrough method, participant scope, privacy handling, and measures.                                            | `CAPSTONE_EVALUATION_METHOD.md`, `CAPSTONE_EVALUATION_PACKET.md`, `CAPSTONE_EVALUATION_WALKTHROUGH.md` |
| Results                             | Summarize actual recorded sessions only after they exist.                                                                 | `CAPSTONE_EVALUATION_RESULTS.md`, `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`                            |
| Discussion                          | Interpret what the implementation and walkthrough evidence mean.                                                          | `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`, `CAPSTONE_ARGUMENT.md`                                      |
| Limitations                         | State small sample, deterministic scoring, deferred integrations, no student validation, and no broad productivity proof. | `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`, `CAPSTONE_EVALUATION_METHOD.md`                             |
| Future Work                         | Explain calendar context, constrained chat, MCP-style tools, longitudinal evaluation, and student scope as later work.    | `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`, `JIT_PLANNER_UI_SPEC.md`                                    |
| Conclusion                          | Return to the "What should I do today?" question and controlled Gen UI contribution.                                      | `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`, `CAPSTONE_ARGUMENT.md`                                      |

## 1. Introduction

Goal:

- Introduce the problem: task storage alone does not answer what to do next.
- Establish faculty/staff scope.
- State that the capstone builds on the original WSIDT SRS.
- Present the planner-first thesis.

Use these artifacts:

- `CAPSTONE_ARGUMENT.md`: one-sentence claim and thesis.
- `CAPSTONE_NOTES.md`: target user scope refinement and capstone narrative.

Claim to make:

```text
The project addresses daily planning support for UPOU faculty and staff by
turning task data into contextual daily recommendations.
```

Claim to avoid:

```text
The system proves measurable productivity improvement across UPOU.
```

## 2. Background And Source Study

Goal:

- Explain that Crisanto's paper grounds the project requirements.
- Clarify that the study scope is UPOU employees, including faculty, research
  assistants, and staff.
- Explain why students are future or adjacent scope.
- Discuss common planning methods only as context, not as backend choices.

Use these artifacts:

- `CAPSTONE_NOTES.md`: source study scope and wording.
- `CAPSTONE_ARGUMENT.md`: Crisanto requirements grounding.

Claim to make:

```text
Crisanto's study motivates a system that supports planning and productivity
tracking for UPOU employees, centered around the daily question "What should I
do today?"
```

Claim to avoid:

```text
Crisanto's study validates the current implementation for students.
```

## 3. Requirements And SRS Reconciliation

Goal:

- Show that the original SRS is not abandoned.
- Explain the broad task-management baseline.
- Identify `F-12 Suggested tasks`, personal scheduling, energy tracking, and
  productivity reporting as the most relevant requirements for the capstone
  contribution.
- Explain deferred features honestly.

Use these artifacts:

- `SRS_TRACEABILITY_MATRIX.md`
- `docs/srs.html`
- `CAPSTONE_ARGUMENT.md`

Key framing:

```text
The generic todo features support the planner by providing trusted task data.
The innovation is not more task CRUD, but the daily planning layer.
```

## 4. System Design

Goal:

- Explain Option 1.5 architecture.
- Django owns state, validation, permissions, audit-friendly transitions, and
  typed operations.
- React renders planner-first and just-in-time UI.
- Future assistants call typed operations only.
- LLM/chat/MCP layers do not get raw database access.

Use these artifacts:

- `JIT_PLANNER_UI_SPEC.md`
- `FREEZE_NOTES.md`
- `CAPSTONE_NOTES.md`

Required terms to define:

- Human-Computer Interaction (HCI)
- generative UI
- just-in-time UI
- typed operation
- component registry
- UI schema
- grounding

Claim to make:

```text
The system generates structured UI decisions and typed planner actions, not
arbitrary frontend code or raw database mutations.
```

## 5. Implementation

Goal:

- Describe the actual software built.
- Keep focus on planner-specific implementation.
- Mention the baseline task system briefly, then move to planner models,
  endpoints, frontend modes, and assistant panel.

Use these artifacts:

- `DEV_JOURNAL.md`
- `JIT_PLANNER_UI_SPEC.md`
- `CAPSTONE_REHEARSAL_NOTES.md`

Implementation points:

- security/privacy freeze before planner work
- `EnergyCheckIn`
- `TodayPlan`
- `PlanItem`
- `TodayPlanFeedback`
- planner scoring and task signals
- `/api/planner/today/`
- `/api/planner/check-in/`
- `/api/planner/rebuild/`
- suggestion accept/snooze/dismiss
- `/api/planner/evaluation/`
- `/api/planner/tools/`
- `/api/planner/tools/{tool_name}/invoke/`
- backend-owned `ui_schema`
- React component registry
- `/today` planner dashboard
- `PlannerAssistantCard`

## 6. Evaluation Method

Goal:

- Explain that evaluation measures the planning claim, not broad productivity.
- Describe the walkthrough, ratings, observation checklist, and privacy rules.
- Separate demo evidence from participant/adviser evidence.

Use these artifacts:

- `CAPSTONE_EVALUATION_METHOD.md`
- `CAPSTONE_EVALUATION_PACKET.md`
- `CAPSTONE_EVALUATION_WALKTHROUGH.md`
- `CAPSTONE_EVALUATION_RESULTS.md`

Measures:

- helpfulness rating
- confidence rating
- whether next task was clear
- whether suggestion reason was understood
- accept/snooze/dismiss actions
- whether planner assistant typed actions were understandable
- qualitative friction points

Privacy boundary:

```text
Do not report task titles, descriptions, participant names, email addresses,
course names, student names, or raw identifying feedback notes.
```

## 7. Results

Goal:

- Do not invent results.
- Use actual entries from `CAPSTONE_EVALUATION_RESULTS.md`.
- If no real walkthrough exists yet, report only implementation/demo readiness
  evidence and clearly label it.

Use these artifacts:

- `CAPSTONE_EVALUATION_RESULTS.md`
- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`
- `CAPSTONE_REHEARSAL_NOTES.md`
- `CAPSTONE_DEMO_RUN.md`

Allowed if no real walkthrough exists:

```text
At the time of writing, no participant walkthrough results had been recorded.
The system had implementation and automated demo-readiness evidence, including
backend tests, frontend checks, fixture-backed Playwright walkthroughs, and a
real-backend Playwright demo.
```

Do not write:

```text
Users found the planner helpful.
```

unless real recorded user/adviser/pilot results support it.

## 8. Discussion

Goal:

- Interpret results against the capstone claim.
- Explain why planner-first UI is different from task management.
- Explain how controlled Gen UI addresses the planning problem.
- Explain why typed operations matter for future chat/MCP/voice.

Use these artifacts:

- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`
- `CAPSTONE_ARGUMENT.md`
- `JIT_PLANNER_UI_SPEC.md`

Core discussion point:

```text
The same task data can produce different planning surfaces depending on energy,
available time, and urgency. That is the HCI contribution of just-in-time UI in
this project.
```

## 9. Limitations

Goal:

- Be explicit and conservative.

Use these artifacts:

- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`
- `CAPSTONE_EVALUATION_METHOD.md`

Limitations to include:

- small or pending participant sample
- deterministic planner scoring
- task data quality affects recommendations
- no full Google Calendar sync
- no free-form chat/voice/MCP UI yet
- students not validated by the source study
- automated demos are not participant evidence
- no long-term productivity measurement

## 10. Future Work

Goal:

- Show a credible path forward without weakening current scope.

Use these artifacts:

- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`
- `JIT_PLANNER_UI_SPEC.md`

Future work:

- conduct real walkthroughs with UPOU faculty/staff
- refine task signals and effort estimates
- add opt-in Google Calendar context
- build constrained chat shell using typed planner tools
- expose MCP-style typed operations
- run longitudinal evaluation
- revisit student scope separately

## 11. Conclusion

Goal:

- Return to the thesis.
- State the contribution plainly.

Use these artifacts:

- `CAPSTONE_ARGUMENT.md`
- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`

Suggested close:

```text
The project demonstrates that the original WSIDT SRS can be implemented as a
planner-first productivity tracker rather than a generic todo clone. By using
controlled just-in-time UI and typed planner operations, the prototype turns
stored task data into contextual support for answering "What should I do
today?"
```

## Final Paper Checklist

Before submitting:

- Source-study scope says faculty/staff, not validated students.
- SRS reconciliation is referenced.
- Gen UI is described as controlled UI decision generation.
- Typed operations are defined.
- Google Calendar is future context/sync, not current backend.
- Results do not invent participant findings.
- Seeded demo evidence is labeled as demo evidence.
- Privacy rules remove task content and identifiers.
- Limitations are explicit.
- Future work does not imply unfinished required scope.
