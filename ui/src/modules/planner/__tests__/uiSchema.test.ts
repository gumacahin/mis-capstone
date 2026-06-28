import { describe, expect, it } from "vitest";

import type { PlannerSuggestion, TodayPlan } from "../types";
import { buildPlannerUiSchema, visiblePlannerSuggestions } from "../uiSchema";

const baseTask = {
  id: 101,
  title: "Review LMS submissions",
  description: "",
  priority: "high",
  due_date: "2026-06-28",
  project_title: "Teaching",
  section_title: "Assessments",
};

const baseSuggestion: PlannerSuggestion = {
  id: 40,
  task: baseTask,
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

const basePlan: TodayPlan = {
  id: 20,
  date: "2026-06-28",
  status: "active",
  generated_at: "2026-06-28T08:00:00Z",
  check_in: {
    id: 30,
    date: "2026-06-28",
    energy_level: "medium",
    available_minutes: 120,
    focus_mode: "flexible",
    context: "Morning prep before class",
    created_at: "2026-06-28T08:00:00Z",
    updated_at: "2026-06-28T08:00:00Z",
  },
  suggestions: [baseSuggestion],
  feedback: null,
  created_at: "2026-06-28T08:00:00Z",
  updated_at: "2026-06-28T08:00:00Z",
};

describe("buildPlannerUiSchema", () => {
  it("returns the check-in card and default today plan card", () => {
    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: basePlan,
    });

    expect(schema).toHaveLength(2);
    expect(schema[0]).toMatchObject({
      component: "EnergyCheckInCard",
      mode: "default",
      title: "Plan today",
      allowedActions: [],
    });
    expect(schema[1]).toMatchObject({
      component: "TodayPlanCard",
      mode: "default",
      title: "Suggested next",
      suggestionIds: [40],
      allowedActions: ["accept", "snooze", "dismiss"],
    });
  });

  it("selects the low-energy card when the check-in energy is low", () => {
    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: makePlan({
        checkIn: { energy_level: "low" },
      }),
    });

    expect(schema[1]).toMatchObject({
      component: "LowEnergyPlanCard",
      mode: "low_energy",
      title: "Low-energy plan",
      message: "Start with smaller next actions while preserving urgent work.",
      highlights: ["Energy low", "Flexible focus"],
    });
  });

  it("selects the time-box card and only includes tasks that fit", () => {
    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: makePlan({
        checkIn: { available_minutes: 45 },
        suggestions: [
          makeSuggestion({
            id: 40,
            estimatedMinutes: 45,
          }),
          makeSuggestion({
            id: 41,
            estimatedMinutes: 75,
            task: {
              id: 102,
              title: "Longer task",
              due_date: "2026-06-28",
            },
          }),
        ],
      }),
    });

    expect(schema[1]).toMatchObject({
      component: "TimeBoxPlanCard",
      mode: "limited_time",
      title: "Fits your time",
      message: "Showing tasks that fit within 45 minutes.",
      highlights: ["45 minutes", "1 fit"],
      suggestionIds: [40],
    });
  });

  it("shows the shortest next action when no task fits the available time", () => {
    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: makePlan({
        checkIn: { available_minutes: 20 },
        suggestions: [
          makeSuggestion({
            id: 40,
            estimatedMinutes: 45,
          }),
          makeSuggestion({
            id: 41,
            estimatedMinutes: 30,
            task: {
              id: 102,
              title: "Shortest task",
              due_date: "2026-06-28",
            },
          }),
        ],
      }),
    });

    expect(schema[1]).toMatchObject({
      component: "TimeBoxPlanCard",
      mode: "limited_time",
      title: "Fits your time",
      message:
        "No task fully fits 20 minutes, so the shortest next action is shown.",
      highlights: ["20 minutes", "Closest fit"],
      suggestionIds: [41],
    });
  });

  it("prioritizes overdue triage and only includes overdue suggestions", () => {
    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: makePlan({
        checkIn: {
          available_minutes: 45,
          energy_level: "low",
        },
        suggestions: [
          makeSuggestion({
            id: 40,
            task: { id: 101, due_date: "2026-06-27" },
            dueStatus: "overdue",
          }),
          makeSuggestion({
            id: 41,
            task: {
              id: 102,
              title: "Prepare overdue report",
              due_date: "2026-06-26",
            },
            dueStatus: "overdue",
          }),
          makeSuggestion({
            id: 42,
            task: {
              id: 103,
              title: "Due today admin note",
              due_date: "2026-06-28",
            },
            dueStatus: "due_today",
          }),
        ],
      }),
    });

    expect(schema[1]).toMatchObject({
      component: "TaskTriagePanel",
      mode: "overdue_triage",
      title: "Overdue triage",
      message: "Focus on overdue work before scanning the full task list.",
      highlights: ["2 overdue", "Urgent first"],
      suggestionIds: [40, 41],
    });
  });

  it("returns an unavailable card when the planner query fails", () => {
    const schema = buildPlannerUiSchema({
      isError: true,
      isPending: false,
      plan: basePlan,
    });

    expect(schema).toEqual([
      {
        component: "PlannerUnavailableCard",
        mode: "unavailable",
        title: "Planner unavailable",
        allowedActions: [],
      },
    ]);
  });

  it("uses the default suggestions card while loading or empty", () => {
    const loadingSchema = buildPlannerUiSchema({
      isError: false,
      isPending: true,
      plan: undefined,
    });
    const emptySchema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan: makePlan({ suggestions: [] }),
    });

    expect(loadingSchema[1]).toMatchObject({
      component: "TodayPlanCard",
      mode: "default",
      title: "Suggested next",
      suggestionIds: [],
    });
    expect(emptySchema[1]).toMatchObject({
      component: "TodayPlanCard",
      mode: "default",
      title: "Suggested next",
      suggestionIds: [],
    });
  });

  it("excludes dismissed suggestions from visible suggestions and schema ids", () => {
    const dismissedSuggestion = makeSuggestion({
      id: 41,
      status: "dismissed",
    });
    const plan = makePlan({
      suggestions: [baseSuggestion, dismissedSuggestion],
    });

    expect(
      visiblePlannerSuggestions(plan).map((suggestion) => suggestion.id),
    ).toEqual([40]);

    const schema = buildPlannerUiSchema({
      isError: false,
      isPending: false,
      plan,
    });

    expect(schema[1].suggestionIds).toEqual([40]);
  });
});

function makePlan({
  checkIn = {},
  suggestions = [baseSuggestion],
}: {
  checkIn?: Partial<TodayPlan["check_in"]>;
  suggestions?: PlannerSuggestion[];
} = {}): TodayPlan {
  return {
    ...basePlan,
    check_in: {
      ...basePlan.check_in,
      ...checkIn,
    },
    suggestions,
  };
}

function makeSuggestion({
  id = baseSuggestion.id,
  estimatedMinutes = baseSuggestion.estimated_minutes,
  dueStatus = baseSuggestion.signals.due_status,
  score = baseSuggestion.score,
  status = baseSuggestion.status,
  task = {},
}: {
  id?: number;
  estimatedMinutes?: number;
  dueStatus?: PlannerSuggestion["signals"]["due_status"];
  score?: number;
  status?: PlannerSuggestion["status"];
  task?: Partial<PlannerSuggestion["task"]>;
} = {}): PlannerSuggestion {
  return {
    ...baseSuggestion,
    id,
    estimated_minutes: estimatedMinutes,
    score,
    status,
    signals: {
      ...baseSuggestion.signals,
      due_status: dueStatus,
      estimated_minutes: estimatedMinutes,
      score,
    },
    task: {
      ...baseSuggestion.task,
      ...task,
    },
  };
}
