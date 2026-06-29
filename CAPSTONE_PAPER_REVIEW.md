# Capstone Paper Review

Date: 2026-06-29

## Review Scope

Reviewed `CAPSTONE_PAPER_DRAFT.md` against:

- `CAPSTONE_PAPER_OUTLINE.md`
- `CAPSTONE_ARGUMENT.md`
- `SRS_TRACEABILITY_MATRIX.md`
- `CAPSTONE_EVALUATION_METHOD.md`
- `CAPSTONE_EVALUATION_RESULTS.md`
- `CAPSTONE_RESULTS_DISCUSSION_TEMPLATE.md`

This review focuses on paper quality, support for claims, missing evidence, and
submission readiness. It is not a code review.

## Findings

### High: Results Are Correctly Marked Pending, But The Paper Needs A Final Decision Before Submission

The draft clearly states that no adviser, pilot, or participant walkthrough
results have been recorded. That is honest and prevents overclaiming. Before
submission, the author must decide whether the final paper will report:

- automated demo-readiness evidence only, or
- at least one adviser, pilot, or participant walkthrough result recorded in
  `CAPSTONE_EVALUATION_RESULTS.md`.

If no real walkthrough is recorded, the Results section should remain narrow and
should avoid language such as "users found the planner helpful."

### High: Citations Are Still Placeholders

The draft names Crisanto's paper but does not yet include formal citation
formatting, bibliography entries, or in-text citation style. This must be fixed
according to the course format before final submission.

The draft should also decide whether to cite any background sources for HCI,
generative UI, or just-in-time interfaces. If no external sources are added,
the paper should frame those as design terms used in the project rather than as
a literature-review claim.

### Medium: Figures Or Tables Would Strengthen The Design And Implementation Sections

The draft is readable, but it would be easier to defend with at least two
paper-facing visuals:

- an architecture diagram showing Django/DRF, React, planner service, typed
  tools, and future chat/MCP layer
- a planner flow diagram showing check-in, suggestion generation, reason
  inspection, accept/snooze/dismiss, feedback, and aggregate reporting

Optional additions:

- a table mapping SRS features to planner reinterpretation
- a screenshot of `/today` showing planner suggestions and the assistant panel

### Medium: Evaluation Method Is Strong, But The Results Section Needs A Versioned Evidence Snapshot

The draft lists verification results, but it should include a stable snapshot of
the exact demo-readiness baseline if it is submitted before participant
evidence exists. The current baseline is documented in
`CAPSTONE_REHEARSAL_NOTES.md` and should be copied into final paper language
only after deciding the submission date.

### Medium: The Implementation Section Should Avoid Becoming A Feature Inventory

The draft appropriately lists planner models and endpoints. During final
editing, the implementation section should keep the emphasis on why each piece
supports planning:

- `EnergyCheckIn` explains current context.
- `TodayPlan` represents the daily decision.
- `PlanItem` captures explainable recommendations.
- typed tools support safe assistant interaction.
- aggregate reporting supports evaluation without exposing task content.

### Low: Title Is Strong But Long

The current title is accurate but long:

```text
"What Should I Do Today?": A Planner-First Productivity Tracker Using
Just-in-Time UI and Typed Planner Operations
```

If the final paper needs a shorter title, use:

```text
A Planner-First Productivity Tracker for UPOU Faculty and Staff
```

and keep the "What should I do today?" phrase in the introduction.

## Recommended Immediate Fixes

1. Add citation placeholders and a References section to
   `CAPSTONE_PAPER_DRAFT.md`.
2. Add figure/table placeholders for architecture, planner flow, SRS mapping,
   and `/today` screenshot.
3. Add a note in the Results section that final verification numbers should be
   copied from `CAPSTONE_REHEARSAL_NOTES.md` at submission time.
4. Keep `CAPSTONE_EVALUATION_RESULTS.md` as the only source for real
   walkthrough findings.

## Remaining Before Final Submission

- Run at least one adviser or pilot walkthrough if possible.
- Record anonymized results in `CAPSTONE_EVALUATION_RESULTS.md`.
- Replace pending Results placeholders with actual recorded evidence.
- Add formal citations and bibliography.
- Add screenshots or diagrams if required by the course.
- Check the final paper against the claims-to-avoid list in
  `CAPSTONE_ARGUMENT.md`.
