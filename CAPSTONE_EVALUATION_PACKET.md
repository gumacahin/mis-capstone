# Capstone Evaluation Packet

## Purpose

This packet is the field-ready version of the capstone evaluation method. Use
it for adviser walkthroughs, pilot sessions, or small participant sessions that
evaluate whether the planner helps UPOU faculty and staff answer:

```text
What should I do today?
```

This packet evaluates the planner-first and just-in-time UI slice. It does not
evaluate the app as a full Todoist, Trello, Google Calendar, or LMS
replacement.

## Use Boundaries

- Use this as capstone evaluation material, not as a formal ethics approval
  document.
- Follow any institutional requirements before treating sessions as human
  subjects research.
- If only the developer or adviser runs the packet, label the result as demo or
  adviser review evidence, not participant evidence.
- Do not record private task titles, names, email addresses, course names,
  student names, or raw identifiable notes.
- Report findings in aggregate or as anonymized summaries.

## Session Setup

Session ID:

Date:

Moderator:

Participant group:

```text
faculty / staff / adviser / demo / other
```

Dataset:

```text
seeded demo / participant account / anonymized task set
```

Environment:

```text
local demo / deployed app / screen-share / in-person
```

## Moderator Opening Script

Read this before the walkthrough:

```text
This walkthrough is about the Today planner. I am evaluating whether it helps
you decide what to work on next, whether the suggestion reasons are
understandable, and whether the check-in makes the plan fit your current
situation. This is not a test of you. If something is confusing, that is useful
feedback about the system.
```

Then say:

```text
Please think aloud as you use the planner. Say what you expected, what was
useful, what was confusing, and what you would do next in a real workday.
```

If the planner assistant panel is shown, add:

```text
The planner assistant is a deterministic demo of typed operations. It is not a
full chat interface yet. The buttons call allowlisted planner actions through
the backend.
```

## Participant Task Sheet

Give the participant this scenario when using seeded demo data:

```text
Imagine you are starting your workday with limited energy and about 90 minutes
available before meetings. You already have teaching, admin, and research tasks
in the planner. Use the Today page to decide what you should work on next.
```

Ask the participant to complete these tasks:

1. Open `/today`.
2. Review the suggested tasks without clicking anything yet.
3. Complete or update the check-in:
   energy level, available minutes, focus mode, and optional context.
4. Pick the suggestion that seems most appropriate to do next.
5. Open `Why this?` for that suggestion.
6. Explain in your own words why the planner recommended it.
7. Accept one suggestion.
8. Snooze or dismiss one suggestion if it does not fit the current moment.
9. Use the planner assistant panel to run one typed action, for example by
   clicking `Show current plan`.
10. Submit plan feedback with helpfulness and confidence ratings.
11. Say whether you would use this planner in your daily workflow.

For a participant using their own account, replace the scenario with:

```text
Use your current task list as you normally would at the start of the day. Treat
the Today page as a planning assistant that should help you decide what to work
on next.
```

## Observation Sheet

Record observations without private task content.

| Observation Item                                                 | Yes | Partial | No  | Notes |
| ---------------------------------------------------------------- | --- | ------- | --- | ----- |
| Understood that `/today` is for planning, not only listing tasks |     |         |     |       |
| Completed the check-in without help                              |     |         |     |       |
| Noticed the suggested task order                                 |     |         |     |       |
| Opened at least one suggestion reason                            |     |         |     |       |
| Could explain why a task was suggested                           |     |         |     |       |
| Trusted or accepted the suggested next task                      |     |         |     |       |
| Used snooze or dismiss appropriately                             |     |         |     |       |
| Understood that the assistant panel uses typed operations        |     |         |     |       |
| Submitted feedback                                               |     |         |     |       |
| Stated a clear next task by the end                              |     |         |     |       |

Non-identifying behavior notes:

```text

```

Moments of confusion or hesitation:

```text

```

Information the participant expected but did not see:

```text

```

## Post-Task Rating Form

Use a 1 to 5 scale.

```text
1 = strongly disagree
2 = disagree
3 = neutral or mixed
4 = agree
5 = strongly agree
```

| Statement                                                              | Rating |
| ---------------------------------------------------------------------- | ------ |
| The planner helped me decide what to work on next.                     |        |
| The suggested task order made sense.                                   |        |
| The suggestion reason was understandable.                              |        |
| The check-in made the plan feel more relevant to my current situation. |        |
| The planner reduced the effort of deciding what to do today.           |        |
| I felt confident about the next task after using the planner.          |        |
| I would consider using this planner as part of my daily workflow.      |        |
| The planner assistant's typed actions were understandable.             |        |

## Post-Task Questions

Ask these after the rating form:

1. What made the suggested plan useful or not useful?
2. Was the reason for the recommended task understandable?
3. Did the check-in change how well the plan matched your current situation?
4. What information was missing when deciding what to do next?
5. Did the planner assistant panel make the typed-operation idea clearer or
   more confusing?
6. Would you use this planner as part of your daily workflow? Why or why not?
7. If calendar integration is added later, what calendar information would be
   most useful for deciding what to do today?

Summarized answers:

```text

```

## In-App Evidence To Capture

Use only aggregate or non-identifying evidence.

- Helpfulness rating
- Confidence rating
- Whether feedback was submitted
- Whether a suggestion was accepted
- Whether a suggestion was snoozed
- Whether a suggestion was dismissed
- Whether the participant inspected `Why this?`
- Whether the participant used the planner assistant panel

Do not capture:

- private task titles
- task descriptions
- usernames or email addresses
- course, student, or project names that identify a person
- raw free-form notes tied to a participant

## Analysis Mapping

Use this table when converting session notes into capstone findings.

| Evaluation Question                                               | Evidence Source                                       | Positive Signal                                                         |
| ----------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| Did the planner help the user choose what to work on next?        | Next-task clarity, accept action, helpfulness rating  | Participant identifies a next task and rates usefulness near 4 or 5     |
| Did the user understand why a task was suggested?                 | `Why this?` explanation, observation notes            | Participant explains the reason in their own words                      |
| Did check-in context matter?                                      | Check-in update, relevance rating, post-task answer   | Participant says energy/time/focus changed the plan fit                 |
| Did JIT UI reduce planning friction?                              | Hesitation notes, effort rating, confidence rating    | Participant reports less effort deciding what to do                     |
| Did typed assistant actions make the architecture understandable? | Assistant task, typed-action rating, post-task answer | Participant understands that actions are constrained backend operations |
| Did evaluation preserve privacy?                                  | Privacy review, reporting output                      | Notes and findings exclude task content and identifiers                 |

## Interpretation Guide

Use cautious language in the paper.

- Strong signal: most ratings are near 4 or 5, the participant identifies a next
  task, and the suggestion reason can be explained in their own words.
- Mixed signal: ratings are near 3, the participant can complete the flow but
  needs help interpreting reasons or typed actions.
- Weak signal: ratings are below 3, the participant ignores the suggested plan,
  or the reason does not help them decide.

For small capstone samples, treat results as formative evidence. Avoid broad
claims such as "faculty are more productive." Prefer narrower claims such as
"participants in the walkthrough found the planner useful for selecting a next
task."

## Privacy Review

Complete this before using the session in the paper:

```text
Session ID:
Task titles removed: yes / no
Names and email addresses removed: yes / no
Course or student identifiers removed: yes / no
Free-form notes paraphrased: yes / no
Seeded demo data separated from participant evidence: yes / no
Only aggregate metrics reported: yes / no
Reviewer initials:
```

## Paper-Ready Evidence Statement

Use or adapt this after one or more sessions:

```text
The evaluation used a guided walkthrough of the Today planner. Participants
completed an energy, time, and focus check-in, reviewed suggested tasks,
inspected a recommendation reason, acted on suggestions, and submitted
helpfulness and confidence feedback. The moderator recorded non-identifying
observations about whether the participant could choose a next task and explain
the recommendation. Findings were reported using aggregate ratings, suggestion
action rates, and anonymized qualitative summaries.
```
