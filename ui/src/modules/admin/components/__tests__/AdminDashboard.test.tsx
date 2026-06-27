import { usePlannerEvaluationSummary } from "@planner/hooks";
import { useDashboard } from "@shared/hooks/queries";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";

import AdminDashboard from "../AdminDashboard";

vi.mock("@planner/hooks", () => ({
  usePlannerEvaluationSummary: vi.fn(),
}));

vi.mock("@shared/hooks/queries", () => ({
  useDashboard: vi.fn(),
}));

const dashboardData = {
  total_tasks: { total: 12, percent_increase: 10 },
  active_users: { total: 4, percent_increase: 0 },
  pending_tasks: { total: 5, percent_increase: -5 },
  completed_tasks: { total: 58.33, percent_increase: 8 },
  weekly_trends: [
    { day: "Mon", created: 2, completed: 1 },
    { day: "Tue", created: 1, completed: 2 },
  ],
  priority_distribution: [
    {
      priority: "HIGH",
      count: 3,
      percent: 25,
      completion_rate: 50,
      avg_completion_time: 2,
      overdue_count: 1,
    },
  ],
};

const plannerEvaluation = {
  plan_count: 42,
  feedback_count: 7,
  feedback_response_rate: 66.67,
  average_helpfulness_rating: 4.4,
  average_confidence_rating: 3.8,
  total_suggestions: 12,
  suggestion_status_counts: {
    suggested: 2,
    accepted: 5,
    snoozed: 3,
    dismissed: 2,
    done: 0,
  },
  suggestion_action_rates: {
    accepted: 41.67,
    snoozed: 25,
    dismissed: 16.67,
  },
};

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.mocked(useDashboard).mockReturnValue({
      data: dashboardData,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useDashboard>);
    vi.mocked(usePlannerEvaluationSummary).mockReturnValue({
      data: plannerEvaluation,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof usePlannerEvaluationSummary>);
  });

  it("renders aggregate planner evaluation metrics", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Planner Evaluation")).toBeInTheDocument();
    expect(screen.getByText("Plans generated")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("12 suggestions")).toBeInTheDocument();
    expect(screen.getByText("Feedback response rate")).toBeInTheDocument();
    expect(screen.getByText("66.67%")).toBeInTheDocument();
    expect(screen.getByText("7 responses")).toBeInTheDocument();
    expect(screen.getByText("Avg helpfulness")).toBeInTheDocument();
    expect(screen.getByText("4.4 / 5")).toBeInTheDocument();
    expect(screen.getByText("Avg confidence")).toBeInTheDocument();
    expect(screen.getByText("3.8 / 5")).toBeInTheDocument();
    expect(screen.getByText("41.67%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("16.67%")).toBeInTheDocument();
    expect(screen.queryByText(/private/i)).not.toBeInTheDocument();
  });
});
