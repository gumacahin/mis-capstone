import { expect, type Page, test } from "@playwright/test";

const inboxProject = {
  id: 1,
  title: "Inbox",
  is_default: true,
  order: 1,
  view: "list",
  sections: [
    {
      id: 10,
      title: "Inbox",
      is_default: true,
      project: 1,
      order: 1,
      tasks: [],
    },
  ],
};

const profile = {
  id: 1,
  name: "Todo User",
  email: "e2e-user@example.test",
  picture: "",
  is_student: false,
  is_faculty: true,
  is_onboarded: true,
  email_digest_enabled: true,
  theme: "system",
  projects: [inboxProject],
};

const suggestedTask = {
  id: 101,
  title: "Review LMS submissions",
  description: "",
  priority: "high",
  due_date: "2026-06-27",
  project_title: "Teaching",
  section_title: "Assessments",
};

const suggestedSignals = {
  due_date: "2026-06-27",
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
};

interface PlannerFeedbackMock {
  id: number;
  helpfulness_rating: number;
  confidence_rating: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

interface PlannerFeedbackPayload {
  helpfulness_rating: number;
  confidence_rating: number;
  note?: string;
}

interface PlannerToolInvocationMock {
  toolName: string;
  arguments: Record<string, unknown>;
}

interface PlannerUiSchemaMock {
  component: string;
  mode: string;
  title: string;
  message: string;
  highlights: string[];
  suggestion_ids: number[];
  allowed_actions: string[];
}

const initialPlan = {
  id: 20,
  date: "2026-06-27",
  status: "active",
  generated_at: "2026-06-27T08:00:00Z",
  check_in: {
    id: 30,
    date: "2026-06-27",
    energy_level: "medium",
    available_minutes: 120,
    focus_mode: "flexible",
    context: "Morning prep before class",
    created_at: "2026-06-27T08:00:00Z",
    updated_at: "2026-06-27T08:00:00Z",
  },
  suggestions: [
    {
      id: 40,
      task: suggestedTask,
      order: 1,
      reason: "Due today, high priority, fits your available time.",
      estimated_minutes: 45,
      score: 94,
      signals: suggestedSignals,
      status: "suggested",
      snoozed_until: null,
      accepted_at: null,
      dismissed_at: null,
      created_at: "2026-06-27T08:00:00Z",
      updated_at: "2026-06-27T08:00:00Z",
    },
  ],
  feedback: null as PlannerFeedbackMock | null,
  created_at: "2026-06-27T08:00:00Z",
  updated_at: "2026-06-27T08:00:00Z",
};

type TodayPlanMock = typeof initialPlan & {
  ui_schema?: PlannerUiSchemaMock;
};

const plannerTools = [
  {
    name: "get_today_plan",
    description: "Return the current planner plan.",
    input_schema: { type: "object", properties: {} },
    mutates_state: false,
  },
  {
    name: "submit_check_in",
    description: "Save the current planning context and rebuild suggestions.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
  {
    name: "rebuild_today_plan",
    description: "Rebuild the current planner plan.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
  {
    name: "accept_suggestion",
    description: "Accept a planner suggestion.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
  {
    name: "snooze_suggestion",
    description: "Snooze a planner suggestion.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
  {
    name: "dismiss_suggestion",
    description: "Dismiss a planner suggestion.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
  {
    name: "submit_plan_feedback",
    description: "Save feedback about a generated plan.",
    input_schema: { type: "object", properties: {} },
    mutates_state: true,
  },
];

interface MockTodayApisOptions {
  plan?: TodayPlanMock;
  plannerTodayStatus?: number;
}

const clonePlan = (plan: TodayPlanMock = initialPlan): TodayPlanMock =>
  JSON.parse(JSON.stringify(plan));

async function mockTodayApis(page: Page, options: MockTodayApisOptions = {}) {
  let plan = clonePlan(options.plan);
  const calls = {
    accept: 0,
    dismiss: 0,
    snooze: 0,
    checkInPayload: undefined as
      | {
          energy_level: string;
          available_minutes: number;
          focus_mode: string;
          context: string;
        }
      | undefined,
    feedbackPayload: undefined as PlannerFeedbackPayload | undefined,
    toolInvocations: [] as PlannerToolInvocationMock[],
  };

  await page.route(/\/(?:api\/)?users\/me\/?$/, async (route) => {
    await route.fulfill({ json: profile });
  });
  await page.route(
    /\/(?:api\/)?notifications\/unread_count\/?$/,
    async (route) => {
      await route.fulfill({ json: { count: 0 } });
    },
  );
  await page.route(/\/(?:api\/)?notifications\/?$/, async (route) => {
    await route.fulfill({ json: [] });
  });
  await page.route(/\/api\/projects\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: { count: 1, next: null, previous: null, results: [inboxProject] },
    });
  });
  await page.route(/\/api\/tasks\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: { count: 0, next: null, previous: null, results: [] },
    });
  });
  await page.route(/\/(?:api\/)?planner\/today\/?$/, async (route) => {
    if (options.plannerTodayStatus) {
      await route.fulfill({
        status: options.plannerTodayStatus,
        json: { detail: "Planner unavailable" },
      });
      return;
    }
    await route.fulfill({ json: plan });
  });
  await page.route(/\/(?:api\/)?planner\/tools\/?$/, async (route) => {
    await route.fulfill({ json: plannerTools });
  });
  await page.route(
    /\/(?:api\/)?planner\/tools\/[^/]+\/invoke\/?$/,
    async (route) => {
      const toolName = extractToolName(route.request().url());
      const requestBody = route.request().postDataJSON() as
        | { arguments?: Record<string, unknown> }
        | undefined;
      const toolArguments = requestBody?.arguments ?? {};

      calls.toolInvocations.push({
        toolName,
        arguments: toolArguments,
      });

      if (toolName === "get_today_plan" || toolName === "rebuild_today_plan") {
        if (toolName === "rebuild_today_plan") {
          plan = {
            ...plan,
            updated_at: "2026-06-27T08:16:00Z",
          };
        }
        await route.fulfill({
          json: {
            tool_name: toolName,
            result_type: "today_plan",
            result: plan,
          },
        });
        return;
      }

      if (toolName === "submit_check_in") {
        plan = {
          ...plan,
          check_in: {
            ...plan.check_in,
            ...toolArguments,
            updated_at: "2026-06-27T08:17:00Z",
          },
          ui_schema: buildLowEnergyUiSchema(plan),
          updated_at: "2026-06-27T08:17:00Z",
        };
        await route.fulfill({
          json: {
            tool_name: toolName,
            result_type: "today_plan",
            result: plan,
          },
        });
        return;
      }

      await route.fulfill({
        status: 404,
        json: { detail: `Unknown planner tool: ${toolName}` },
      });
    },
  );
  await page.route(/\/(?:api\/)?planner\/check-in\/?$/, async (route) => {
    calls.checkInPayload = route.request().postDataJSON();
    plan = {
      ...plan,
      check_in: {
        ...plan.check_in,
        ...calls.checkInPayload,
        updated_at: "2026-06-27T08:15:00Z",
      },
      updated_at: "2026-06-27T08:15:00Z",
    };
    await route.fulfill({ json: plan });
  });
  await page.route(/\/(?:api\/)?planner\/feedback\/?$/, async (route) => {
    const feedbackPayload = route
      .request()
      .postDataJSON() as PlannerFeedbackPayload;
    calls.feedbackPayload = feedbackPayload;
    const now = "2026-06-27T08:30:00Z";
    const feedback = {
      id: plan.feedback?.id ?? 50,
      helpfulness_rating: feedbackPayload.helpfulness_rating,
      confidence_rating: feedbackPayload.confidence_rating,
      note: feedbackPayload.note ?? "",
      created_at: plan.feedback?.created_at ?? now,
      updated_at: now,
    };
    plan = {
      ...plan,
      feedback,
      updated_at: now,
    };
    await route.fulfill({ json: feedback });
  });
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/accept\/?$/,
    async (route) => {
      calls.accept += 1;
      const acceptedSuggestion = updateSuggestion(plan, {
        status: "accepted",
        accepted_at: "2026-06-27T08:20:00Z",
        updated_at: "2026-06-27T08:20:00Z",
      });
      plan = replaceSuggestion(plan, acceptedSuggestion);
      await route.fulfill({ json: acceptedSuggestion });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/snooze\/?$/,
    async (route) => {
      calls.snooze += 1;
      const snoozedSuggestion = updateSuggestion(plan, {
        status: "snoozed",
        snoozed_until: "2026-06-27T09:20:00Z",
      });
      plan = replaceSuggestion(plan, snoozedSuggestion);
      await route.fulfill({ json: snoozedSuggestion });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/dismiss\/?$/,
    async (route) => {
      calls.dismiss += 1;
      const dismissedSuggestion = updateSuggestion(plan, {
        status: "dismissed",
        dismissed_at: "2026-06-27T08:25:00Z",
      });
      plan = replaceSuggestion(plan, dismissedSuggestion);
      await route.fulfill({ json: dismissedSuggestion });
    },
  );

  return calls;
}

function extractToolName(url: string) {
  const path = new URL(url).pathname;
  return decodeURIComponent(
    path.match(/planner\/tools\/([^/]+)\/invoke/)?.[1] ?? "",
  );
}

function buildLowEnergyUiSchema(plan: TodayPlanMock): PlannerUiSchemaMock {
  return {
    component: "LowEnergyPlanCard",
    mode: "low_energy",
    title: "Low-energy plan",
    message: "Start with smaller next actions while preserving urgent work.",
    highlights: ["Energy low", "Light focus"],
    suggestion_ids: plan.suggestions.map((suggestion) => suggestion.id),
    allowed_actions: ["accept", "snooze", "dismiss"],
  };
}

function updateSuggestion(
  plan: TodayPlanMock,
  patch: Partial<(typeof initialPlan.suggestions)[number]>,
) {
  return {
    ...plan.suggestions[0],
    ...patch,
  };
}

function replaceSuggestion(
  plan: TodayPlanMock,
  suggestion: (typeof initialPlan.suggestions)[number],
): TodayPlanMock {
  return {
    ...plan,
    suggestions: plan.suggestions.map((item) =>
      item.id === suggestion.id ? suggestion : item,
    ),
  };
}

test.describe("Today Page", () => {
  test("should navigate to today", async ({ page }) => {
    await mockTodayApis(page);

    await page.goto("/today");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/today/);
  });

  test("shows planner check-in and suggested next action", async ({ page }) => {
    const calls = await mockTodayApis(page);

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Plan today" }),
    ).toBeVisible();
    await expect(page.getByLabel("Minutes")).toHaveValue("120");
    await expect(page.getByLabel("Context")).toHaveValue(
      "Morning prep before class",
    );

    await expect(
      page.getByRole("heading", { name: "Suggested next" }),
    ).toBeVisible();
    await expect(page.getByText("Review LMS submissions")).toBeVisible();
    await expect(
      page.getByText(
        "Due today | High priority | 45 min | Teaching / Assessments",
      ),
    ).toBeVisible();
    await expect(page.getByText("45m")).toBeVisible();

    await page.getByLabel("Minutes").fill("45");
    await page.getByRole("button", { name: "Update" }).click();

    await expect.poll(() => calls.checkInPayload?.available_minutes).toBe(45);
    await expect(
      page.getByText("Check-in updated. Suggestions were rebuilt"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Accept" }).click();

    await expect.poll(() => calls.accept).toBe(1);
    await expect(page.getByText("accepted", { exact: true })).toBeVisible();
    await expect(page.getByText("Recorded: accepted.")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Was this plan useful?" }),
    ).toBeVisible();
    await expect(page.getByText("aggregate evaluation evidence")).toBeVisible();
    await page.getByLabel("Helpful rating").fill("4");
    await page.getByLabel("Confidence rating").fill("5");
    await page.getByLabel("Feedback note").fill("Clear next step.");
    await page.getByRole("button", { name: "Save feedback" }).click();

    await expect.poll(() => calls.feedbackPayload?.helpfulness_rating).toBe(4);
    await expect.poll(() => calls.feedbackPayload?.confidence_rating).toBe(5);
    await expect
      .poll(() => calls.feedbackPayload?.note)
      .toBe("Clear next step.");
    await expect(
      page.getByText("Feedback saved", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Feedback saved for evaluation."),
    ).toBeVisible();
  });

  test("shows planner assistant and invokes typed tools", async ({ page }) => {
    const calls = await mockTodayApis(page);

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Planner assistant" }),
    ).toBeVisible();
    await expect(page.getByText("7 typed tools")).toBeVisible();
    await expect(page.getByText("get today plan")).toBeVisible();

    await page.getByRole("button", { name: "Show current plan" }).click();

    await expect
      .poll(() => calls.toolInvocations.at(-1)?.toolName)
      .toBe("get_today_plan");
    await expect(page.getByText("result_type: today_plan")).toBeVisible();
    await expect(page.getByText("1 suggestion | Default plan")).toBeVisible();

    await page.getByRole("button", { name: "Refresh plan" }).click();

    await expect
      .poll(() => calls.toolInvocations.at(-1)?.toolName)
      .toBe("rebuild_today_plan");

    await page.getByRole("button", { name: "Use low-energy mode" }).click();

    await expect
      .poll(() => calls.toolInvocations.at(-1)?.toolName)
      .toBe("submit_check_in");
    await expect
      .poll(() => calls.toolInvocations.at(-1)?.arguments.energy_level)
      .toBe("low");
    await expect(
      page.getByRole("heading", { name: "Low-energy plan" }),
    ).toBeVisible();
  });

  test("shows reason details and task signals just in time", async ({
    page,
  }) => {
    await mockTodayApis(page);

    await page.goto("/today");

    await page.getByRole("button", { name: "Why this?" }).click();

    const reasonRegion = page.getByRole("region", {
      name: "Reason for Review LMS submissions",
    });
    await expect(reasonRegion).toBeVisible();
    await expect(
      reasonRegion.getByText("Why this matters today"),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText(
        "It is due today, is marked high priority, and is estimated at 45 minutes.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(reasonRegion.getByText("Planner rationale")).toBeVisible();
    await expect(
      reasonRegion.getByText(
        "Due today, high priority, fits your available time.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(reasonRegion.getByText("Task signals")).toBeVisible();
    await expect(reasonRegion.getByText("Due", { exact: true })).toBeVisible();
    await expect(
      reasonRegion.getByText("Due today", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Priority", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("High priority", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Effort", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("45 minutes", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Project", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Teaching / Assessments", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Recurrence", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("One-time", { exact: true }),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText("Planner score", { exact: true }),
    ).toBeVisible();
    await expect(reasonRegion.getByText("94", { exact: true })).toBeVisible();
  });

  test("selects low-energy planner UI when check-in energy is low", async ({
    page,
  }) => {
    await mockTodayApis(page, {
      plan: {
        ...clonePlan(),
        check_in: {
          ...clonePlan().check_in,
          energy_level: "low",
        },
      },
    });

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Low-energy plan" }),
    ).toBeVisible();
    await expect(page.getByText("Low energy")).toBeVisible();
    await expect(
      page.getByText("Start with smaller next actions"),
    ).toBeVisible();
    await expect(page.getByText("Flexible focus")).toBeVisible();
  });

  test("shows a time-boxed shortlist when available time is limited", async ({
    page,
  }) => {
    const shortSuggestion = {
      ...clonePlan().suggestions[0],
      id: 41,
      task: {
        ...suggestedTask,
        id: 102,
        title: "Send quick advising reply",
        due_date: "2026-06-27",
      },
      estimated_minutes: 25,
      signals: {
        ...suggestedSignals,
        estimated_minutes: 25,
      },
    };

    await mockTodayApis(page, {
      plan: {
        ...clonePlan(),
        check_in: {
          ...clonePlan().check_in,
          available_minutes: 30,
        },
        suggestions: [clonePlan().suggestions[0], shortSuggestion],
      },
    });

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Fits your time" }),
    ).toBeVisible();
    await expect(
      page.getByText("Showing tasks that fit within 30 minutes."),
    ).toBeVisible();
    await expect(page.getByText("30 minutes", { exact: true })).toBeVisible();
    await expect(page.getByText("1 fit")).toBeVisible();
    await expect(page.getByText("Send quick advising reply")).toBeVisible();
    await expect(page.getByText("Review LMS submissions")).toBeHidden();
  });

  test("snoozes and dismisses planner suggestions", async ({ page }) => {
    const calls = await mockTodayApis(page);

    await page.goto("/today");

    await page.getByRole("button", { name: "Snooze" }).click();
    await expect.poll(() => calls.snooze).toBe(1);
    await expect(page.getByText("snoozed", { exact: true })).toBeVisible();
    await expect(page.getByText("Recorded: snoozed for later.")).toBeVisible();

    await page.getByRole("button", { name: "Dismiss" }).click();
    await expect.poll(() => calls.dismiss).toBe(1);
    await expect(page.getByText("Recorded: dismissed.")).toBeVisible();
    await expect(page.getByText("Review LMS submissions")).toBeHidden();
    await expect(
      page.getByText("No suggestions for the current check-in."),
    ).toBeVisible();
  });

  test("shows empty planner state when there are no suggestions", async ({
    page,
  }) => {
    await mockTodayApis(page, {
      plan: {
        ...clonePlan(),
        suggestions: [],
      },
    });

    await page.goto("/today");

    await expect(
      page.getByText("No suggestions for the current check-in."),
    ).toBeVisible();
  });

  test("shows planner unavailable state", async ({ page }) => {
    await mockTodayApis(page, { plannerTodayStatus: 503 });

    await page.goto("/today");

    await expect(
      page.getByText("Planner is temporarily unavailable."),
    ).toBeVisible({ timeout: 12_000 });
  });
});
