import { expect, test, type Page } from "@playwright/test";

async function mockUpcomingApis(page: Page) {
  await page.route(/\/(?:api\/)?users\/me\/?$/, async (route) => {
    await route.fulfill({
      json: {
        id: 1,
        name: "Todo User",
        email: "e2e-user@example.test",
        picture: "",
        is_student: false,
        is_faculty: true,
        is_onboarded: true,
        email_digest_enabled: true,
        theme: "system",
        projects: [
          {
            id: 1,
            title: "Inbox",
            is_default: true,
            order: 1,
            view: "list",
            sections: [],
          },
        ],
      },
    });
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
        count: 1,
        next: null,
        previous: null,
        results: [
          { id: 1, title: "Inbox", is_default: true, order: 1, view: "list" },
        ],
      },
    });
  });

  await page.route(/\/(?:api\/)?tasks\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
    });
  });
}

test.describe("Upcoming Page - Basic Functionality", () => {
  test("should verify basic upcoming page functionality", async ({ page }) => {
    await mockUpcomingApis(page);
    await page.goto("/upcoming");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/upcoming/);
    await expect(page.locator("#root")).toBeVisible();
  });
});
