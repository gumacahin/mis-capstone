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
      status: "suggested",
      snoozed_until: null,
      accepted_at: null,
      dismissed_at: null,
      created_at: "2026-06-27T08:00:00Z",
      updated_at: "2026-06-27T08:00:00Z",
    },
  ],
  created_at: "2026-06-27T08:00:00Z",
  updated_at: "2026-06-27T08:00:00Z",
};

async function mockTodayApis(page: Page) {
  let plan = initialPlan;
  const calls = {
    accept: 0,
    checkInPayload: undefined as
      | {
          energy_level: string;
          available_minutes: number;
          focus_mode: string;
          context: string;
        }
      | undefined,
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
    await route.fulfill({ json: plan });
  });
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
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/accept\/?$/,
    async (route) => {
      calls.accept += 1;
      const acceptedSuggestion = {
        ...plan.suggestions[0],
        status: "accepted",
        accepted_at: "2026-06-27T08:20:00Z",
        updated_at: "2026-06-27T08:20:00Z",
      };
      plan = { ...plan, suggestions: [acceptedSuggestion] };
      await route.fulfill({ json: acceptedSuggestion });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/snooze\/?$/,
    async (route) => {
      await route.fulfill({
        json: {
          ...plan.suggestions[0],
          status: "snoozed",
          snoozed_until: "2026-06-27T09:20:00Z",
        },
      });
    },
  );
  await page.route(
    /\/(?:api\/)?planner\/suggestions\/40\/dismiss\/?$/,
    async (route) => {
      await route.fulfill({
        json: { ...plan.suggestions[0], status: "dismissed" },
      });
    },
  );

  return calls;
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
      page.getByText("Due today, high priority, fits your available time."),
    ).toBeVisible();
    await expect(page.getByText("45m")).toBeVisible();

    await page.getByLabel("Minutes").fill("45");
    await page.getByRole("button", { name: "Update" }).click();

    await expect.poll(() => calls.checkInPayload?.available_minutes).toBe(45);

    await page.getByRole("button", { name: "Accept" }).click();

    await expect.poll(() => calls.accept).toBe(1);
    await expect(page.getByText("accepted")).toBeVisible();
  });
});
