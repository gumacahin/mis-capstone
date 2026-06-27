import { expect, type Page, test } from "@playwright/test";

const inboxProject = {
  id: 100,
  title: "Inbox",
  is_default: true,
  order: 0,
  view: "list",
  sections: [
    {
      id: 101,
      title: "(No Section)",
      is_default: true,
      project: 100,
      order: 0,
      tasks: [],
    },
  ],
};

const demoProject = {
  id: 200,
  title: "Capstone Evaluation Demo",
  is_default: false,
  order: 1,
  view: "list",
  sections: [
    {
      id: 201,
      title: "Teaching",
      is_default: false,
      project: 200,
      order: 1,
      tasks: [],
    },
    {
      id: 202,
      title: "Admin",
      is_default: false,
      project: 200,
      order: 2,
      tasks: [],
    },
    {
      id: 203,
      title: "Research",
      is_default: false,
      project: 200,
      order: 3,
      tasks: [],
    },
  ],
};

const profile = {
  id: 200,
  name: "Demo Faculty",
  email: "planner-demo@example.test",
  picture: "",
  is_student: false,
  is_faculty: true,
  is_onboarded: true,
  email_digest_enabled: true,
  theme: "system",
  projects: [inboxProject, demoProject],
};

interface FeedbackPayload {
  helpfulness_rating: number;
  confidence_rating: number;
  note?: string;
}

interface CheckInPayload {
  energy_level: string;
  available_minutes: number;
  focus_mode: string;
  context: string;
}

const initialDemoPlan = {
  id: 300,
  date: "2026-06-28",
  status: "active",
  generated_at: "2026-06-28T01:00:00Z",
  check_in: {
    id: 301,
    date: "2026-06-28",
    energy_level: "low",
    available_minutes: 90,
    focus_mode: "light",
    context: "Evaluation walkthrough: limited energy between meetings.",
    created_at: "2026-06-28T01:00:00Z",
    updated_at: "2026-06-28T01:00:00Z",
  },
  suggestions: [
    {
      id: 401,
      task: {
        id: 501,
        title: "Grade overdue reflection submissions",
        description: "A high-priority teaching task that should surface first.",
        priority: "HIGH",
        due_date: "2026-06-27",
        project_title: "Capstone Evaluation Demo",
        section_title: "Teaching",
      },
      order: 1,
      reason: "Overdue, High priority",
      estimated_minutes: 25,
      score: 130,
      signals: {
        due_date: "2026-06-27",
        due_status: "overdue",
        due_label: "Overdue 2026-06-27",
        due_in_days: -1,
        priority: "HIGH",
        priority_label: "High",
        estimated_minutes: 25,
        is_recurring: false,
        project_title: "Capstone Evaluation Demo",
        section_title: "Teaching",
        score: 130,
        snoozed_count: 0,
        dismissed_count: 0,
      },
      status: "suggested",
      snoozed_until: null,
      accepted_at: null,
      dismissed_at: null,
      created_at: "2026-06-28T01:00:00Z",
      updated_at: "2026-06-28T01:00:00Z",
    },
    {
      id: 402,
      task: {
        id: 502,
        title: "Finalize today's class announcement",
        description: "A due-today teaching task for the main walkthrough.",
        priority: "MEDIUM",
        due_date: "2026-06-28",
        project_title: "Capstone Evaluation Demo",
        section_title: "Teaching",
      },
      order: 2,
      reason: "Due today, Medium priority",
      estimated_minutes: 25,
      score: 95,
      signals: {
        due_date: "2026-06-28",
        due_status: "due_today",
        due_label: "Due today",
        due_in_days: 0,
        priority: "MEDIUM",
        priority_label: "Medium",
        estimated_minutes: 25,
        is_recurring: false,
        project_title: "Capstone Evaluation Demo",
        section_title: "Teaching",
        score: 95,
        snoozed_count: 0,
        dismissed_count: 0,
      },
      status: "suggested",
      snoozed_until: null,
      accepted_at: null,
      dismissed_at: null,
      created_at: "2026-06-28T01:00:00Z",
      updated_at: "2026-06-28T01:00:00Z",
    },
    {
      id: 403,
      task: {
        id: 503,
        title: "Review thesis proposal comments",
        description: "Near-term research work with high priority.",
        priority: "HIGH",
        due_date: "2026-07-01",
        project_title: "Capstone Evaluation Demo",
        section_title: "Research",
      },
      order: 3,
      reason: "Due soon, High priority",
      estimated_minutes: 25,
      score: 50,
      signals: {
        due_date: "2026-07-01",
        due_status: "due_soon",
        due_label: "Due soon 2026-07-01",
        due_in_days: 3,
        priority: "HIGH",
        priority_label: "High",
        estimated_minutes: 25,
        is_recurring: false,
        project_title: "Capstone Evaluation Demo",
        section_title: "Research",
        score: 50,
        snoozed_count: 0,
        dismissed_count: 0,
      },
      status: "suggested",
      snoozed_until: null,
      accepted_at: null,
      dismissed_at: null,
      created_at: "2026-06-28T01:00:00Z",
      updated_at: "2026-06-28T01:00:00Z",
    },
  ],
  feedback: null as null | {
    id: number;
    helpfulness_rating: number;
    confidence_rating: number;
    note: string;
    created_at: string;
    updated_at: string;
  },
  created_at: "2026-06-28T01:00:00Z",
  updated_at: "2026-06-28T01:00:00Z",
};

type DemoSuggestion = (typeof initialDemoPlan.suggestions)[number];

function cloneDemoPlan(): typeof initialDemoPlan {
  return JSON.parse(JSON.stringify(initialDemoPlan));
}

function replaceSuggestion(
  plan: typeof initialDemoPlan,
  suggestion: DemoSuggestion,
): typeof initialDemoPlan {
  return {
    ...plan,
    suggestions: plan.suggestions.map((item) =>
      item.id === suggestion.id ? suggestion : item,
    ),
  };
}

async function mockPlannerEvaluationDemoApis(page: Page) {
  let plan = cloneDemoPlan();
  const calls = {
    accepted: 0,
    snoozed: 0,
    dismissed: 0,
    checkInPayload: undefined as CheckInPayload | undefined,
    feedbackPayload: undefined as FeedbackPayload | undefined,
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
      json: {
        count: 2,
        next: null,
        previous: null,
        results: [inboxProject, demoProject],
      },
    });
  });
  await page.route(/\/api\/tasks\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: { count: 0, next: null, previous: null, results: [] },
    });
  });
  await page.route(/\/(?:api\/)?planner\/today\/?$/, async (route) => {
    await route.fulfill({ json: plan });
  });
  await page.route(/\/(?:api\/)?planner\/check-in\/?$/, async (route) => {
    calls.checkInPayload = route.request().postDataJSON() as CheckInPayload;
    plan = {
      ...plan,
      check_in: {
        ...plan.check_in,
        ...calls.checkInPayload,
        updated_at: "2026-06-28T01:10:00Z",
      },
      updated_at: "2026-06-28T01:10:00Z",
    };
    await route.fulfill({ json: plan });
  });
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/401\/accept\/?$/,
    async (route) => {
      calls.accepted += 1;
      const accepted = {
        ...plan.suggestions[0],
        status: "accepted",
        accepted_at: "2026-06-28T01:15:00Z",
        updated_at: "2026-06-28T01:15:00Z",
      };
      plan = replaceSuggestion(plan, accepted);
      await route.fulfill({ json: accepted });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/402\/snooze\/?$/,
    async (route) => {
      calls.snoozed += 1;
      const snoozed = {
        ...plan.suggestions[1],
        status: "snoozed",
        snoozed_until: "2026-06-28T03:15:00Z",
        updated_at: "2026-06-28T01:15:00Z",
      };
      plan = replaceSuggestion(plan, snoozed);
      await route.fulfill({ json: snoozed });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/403\/dismiss\/?$/,
    async (route) => {
      calls.dismissed += 1;
      const dismissed = {
        ...plan.suggestions[2],
        status: "dismissed",
        dismissed_at: "2026-06-28T01:20:00Z",
        updated_at: "2026-06-28T01:20:00Z",
      };
      plan = replaceSuggestion(plan, dismissed);
      await route.fulfill({ json: dismissed });
    },
  );
  await page.route(/\/(?:api\/)?planner\/feedback\/?$/, async (route) => {
    calls.feedbackPayload = route.request().postDataJSON() as FeedbackPayload;
    const now = "2026-06-28T01:25:00Z";
    const feedback = {
      id: 601,
      helpfulness_rating: calls.feedbackPayload.helpfulness_rating,
      confidence_rating: calls.feedbackPayload.confidence_rating,
      note: calls.feedbackPayload.note ?? "",
      created_at: now,
      updated_at: now,
    };
    plan = {
      ...plan,
      feedback,
      updated_at: now,
    };
    await route.fulfill({ json: feedback });
  });

  return calls;
}

test.describe("Planner evaluation demo", () => {
  test("runs the capstone walkthrough flow", async ({ page }, testInfo) => {
    const calls = await mockPlannerEvaluationDemoApis(page);

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Low-energy plan" }),
    ).toBeVisible();
    await expect(page.getByLabel("Minutes")).toHaveValue("90");
    await expect(page.getByLabel("Context")).toHaveValue(
      "Evaluation walkthrough: limited energy between meetings.",
    );
    await expect(
      page.getByText("Lighter next actions for your current energy."),
    ).toBeVisible();

    await expect(
      page.getByText("Grade overdue reflection submissions"),
    ).toBeVisible();
    await expect(
      page.getByText("Finalize today's class announcement"),
    ).toBeVisible();
    await expect(
      page.getByText("Review thesis proposal comments"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Why this?" }).first().click();
    const reasonRegion = page.getByRole("region", {
      name: "Reason for Grade overdue reflection submissions",
    });
    await expect(reasonRegion).toBeVisible();
    await expect(
      reasonRegion.getByText("Why this matters today"),
    ).toBeVisible();
    await expect(
      reasonRegion.getByText(
        "It is overdue, is marked high priority, and is estimated at 25 minutes.",
      ),
    ).toBeVisible();
    await expect(reasonRegion.getByText("Task signals")).toBeVisible();

    await page.getByLabel("Minutes").fill("75");
    await page
      .getByLabel("Context")
      .fill("Pilot walkthrough: choose a realistic next task.");
    await page.getByRole("button", { name: "Update" }).click();
    await expect.poll(() => calls.checkInPayload?.available_minutes).toBe(75);
    await expect
      .poll(() => calls.checkInPayload?.context)
      .toBe("Pilot walkthrough: choose a realistic next task.");

    await page
      .locator("div")
      .filter({ hasText: "Grade overdue reflection submissions" })
      .getByRole("button", { name: "Accept" })
      .first()
      .click();
    await expect.poll(() => calls.accepted).toBe(1);
    await expect(page.getByText("accepted", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Snooze" }).nth(1).click();
    await expect.poll(() => calls.snoozed).toBe(1);
    await expect(page.getByText("snoozed", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Dismiss" }).nth(2).click();
    await expect.poll(() => calls.dismissed).toBe(1);
    await expect(
      page.getByText("Review thesis proposal comments"),
    ).toBeHidden();

    await page.getByLabel("Helpful rating").fill("4");
    await page.getByLabel("Confidence rating").fill("4");
    await page
      .getByLabel("Feedback note")
      .fill("Demo run: recommendation was understandable.");
    await page.getByRole("button", { name: "Save feedback" }).click();
    await expect.poll(() => calls.feedbackPayload?.helpfulness_rating).toBe(4);
    await expect.poll(() => calls.feedbackPayload?.confidence_rating).toBe(4);
    await expect(page.getByText("Feedback saved")).toBeVisible();

    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath("planner-evaluation-demo.png"),
    });
  });
});
