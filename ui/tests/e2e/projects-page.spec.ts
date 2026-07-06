import { expect, type Page, test } from "@playwright/test";

async function mockProjectsApis(page: Page) {
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
          {
            id: 2,
            title: "Alpha",
            is_default: false,
            order: 2,
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
        count: 2,
        next: null,
        previous: null,
        results: [
          { id: 1, title: "Inbox", is_default: true, order: 1, view: "list" },
          { id: 2, title: "Alpha", is_default: false, order: 2, view: "list" },
        ],
      },
    });
  });
}

test.describe("Projects Page - Basic Functionality", () => {
  test("should verify basic projects page functionality", async ({ page }) => {
    await mockProjectsApis(page);
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/projects/);
    const main = page.getByRole("main"); // or locator('main') if no landmark roles
    await expect(
      main.getByRole("heading", { level: 2, name: "My Projects" }),
    ).toBeVisible();
  });
});
