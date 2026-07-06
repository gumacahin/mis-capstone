# AGENTS.md

This file defines repository-specific guidance for AI coding agents working in this project.

## Communication shorthand

When interpreting user instructions in this repository:

- `g` means `game` or `go` (choose by context).
- `k` means `okay`.

If shorthand is ambiguous, ask a brief clarifying question.

## Working expectations

- Prefer small, focused changes.
- Preserve existing project structure and conventions.
- Do not modify unrelated files.
- Run relevant checks/tests for touched areas when practical.
- Clearly summarize what changed and why.

## Commit message convention

Use this format for commit subjects:

- Imperative mood (for example: `Add`, `Fix`, `Refactor`, `Update`).
- Capitalized first word.
- Keep subject concise (target <= 72 characters).
- No trailing period.
- Describe intent, not low-level file edits.

Examples:

- `Fix task reorder regression in project board`
- `Add planner test coverage for archived tasks`
- `Refactor task API hook error handling`
