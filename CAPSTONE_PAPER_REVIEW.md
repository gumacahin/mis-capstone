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

### High: Results Are Clearly Bounded, But Real Walkthrough Evidence Is Still Pending

Status: partially addressed in `CAPSTONE_PAPER_DRAFT.md`.

The draft clearly states that no adviser, pilot, or participant walkthrough
results have been recorded. It now reports implementation and automated
demo-readiness evidence separately from real evaluation evidence. That is honest
and prevents overclaiming. Before submission, the author must decide whether the
final paper will report:

- automated demo-readiness evidence only, or
- at least one adviser, pilot, or participant walkthrough result recorded in
  `CAPSTONE_EVALUATION_RESULTS.md`.

If no real walkthrough is recorded, the Results section should remain narrow and
should avoid language such as "users found the planner helpful."

### Medium: Citation Style Still Needs Final Course-Format Check

Status: partially addressed in `CAPSTONE_PAPER_DRAFT.md`.

The draft now includes an APA-style working in-text citation and reference entry
for Crisanto's paper. Before final submission, confirm whether the course
requires APA, IEEE, or another citation style and convert the reference if
needed.

The draft should also decide whether to cite any background sources for HCI,
generative UI, or just-in-time interfaces. If no external sources are added,
the paper should frame those as design terms used in the project rather than as
a literature-review claim.

### Medium: Figures Or Tables Would Strengthen The Design And Implementation Sections

Status: addressed in `CAPSTONE_PAPER_DRAFT.md`.

The draft now includes:

- an SRS-to-implementation summary table
- a Mermaid architecture diagram showing Django/DRF, React, planner service,
  typed tools, and future chat/MCP layer
- a Mermaid planner flow diagram showing check-in, suggestion generation,
  reason inspection, accept/snooze/dismiss, feedback, and aggregate reporting
- a privacy-safe `/today` screenshot captured from seeded demo data

### Medium: Evaluation Method Is Strong, And The Current Snapshot Is Versioned

Status: addressed for the current implementation baseline.

The draft now includes a stable implementation and demo-readiness snapshot from
the 2026-06-29 rehearsal notes. If another full rehearsal is run before
submission, update the snapshot from `CAPSTONE_REHEARSAL_NOTES.md`; otherwise,
keep the current values and maintain the distinction from participant evidence.

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

1. Confirm the final required citation style and convert the current APA-style
   working reference if needed.
2. Keep `CAPSTONE_EVALUATION_RESULTS.md` as the only source for real
   walkthrough findings.

## Remaining Before Final Submission

- Run at least one adviser or pilot walkthrough if possible.
- Record anonymized results in `CAPSTONE_EVALUATION_RESULTS.md`.
- Replace pending Results placeholders with actual recorded evidence if a real
  walkthrough is completed.
- If no real walkthrough is completed, keep the Results section limited to
  implementation and automated demo-readiness evidence.
- Confirm final citation style.
- Check the final paper against the claims-to-avoid list in
  `CAPSTONE_ARGUMENT.md`.
