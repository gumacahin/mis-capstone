import { describe, expect, it } from "vitest";

import {
  buildSuggestionRelevance,
  buildSuggestionTodayLine,
  formatHistorySignal,
} from "../explanations";
import type { PlannerSuggestion } from "../types";

const baseSuggestion: PlannerSuggestion = {
  id: 40,
  task: {
    id: 101,
    title: "Review LMS submissions",
    description: "",
    priority: "high",
    due_date: "2026-06-28",
    project_title: "Teaching",
    section_title: "Assessments",
  },
  order: 1,
  reason: "Due today, high priority, fits your available time.",
  estimated_minutes: 45,
  score: 94,
  signals: {
    due_date: "2026-06-28",
    due_status: "due_today",
    due_label: "Due today",
    due_in_days: 0,
    priority: "HIGH",
    priority_label: "High",
    estimated_minutes: 45,
    is_recurring: false,
    project_title: "Teaching",
    section_title: "Assessments",
    score: 94,
    snoozed_count: 0,
    dismissed_count: 0,
  },
  status: "suggested",
  snoozed_until: null,
  accepted_at: null,
  dismissed_at: null,
  created_at: "2026-06-28T08:00:00Z",
  updated_at: "2026-06-28T08:00:00Z",
};

describe("planner explanations", () => {
  it("builds a concise today line from planner signals", () => {
    expect(buildSuggestionTodayLine(baseSuggestion)).toBe(
      "Due today | High priority | 45 min | Teaching / Assessments",
    );
  });

  it("explains due-today relevance with priority and effort", () => {
    expect(buildSuggestionRelevance(baseSuggestion)).toBe(
      "It is due today, is marked high priority, and is estimated at 45 minutes.",
    );
  });

  it("adds recurring context when the suggestion is recurring", () => {
    expect(
      buildSuggestionRelevance(
        makeSuggestion({
          signals: {
            is_recurring: true,
          },
        }),
      ),
    ).toBe(
      "It is due today, is marked high priority, and is estimated at 45 minutes. It is recurring, so doing it today keeps the routine moving.",
    );
  });

  it("summarizes previous snooze and dismiss history", () => {
    expect(
      formatHistorySignal(
        makeSuggestion({
          signals: {
            snoozed_count: 2,
            dismissed_count: 1,
          },
        }).signals,
      ),
    ).toBe("snoozed 2x, dismissed 1x");
  });
});

function makeSuggestion({
  signals = {},
}: {
  signals?: Partial<PlannerSuggestion["signals"]>;
} = {}): PlannerSuggestion {
  return {
    ...baseSuggestion,
    signals: {
      ...baseSuggestion.signals,
      ...signals,
    },
  };
}
