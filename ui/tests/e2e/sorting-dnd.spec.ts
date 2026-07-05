import { expect, test, type Page } from "@playwright/test";

const projects = [
  { id: 1, title: "Inbox", is_default: true, order: 1, view: "list", sections: [] },
  { id: 2, title: "Alpha", is_default: false, order: 2, view: "list", sections: [] },
  { id: 3, title: "Beta", is_default: false, order: 3, view: "list", sections: [] },
];

async function mockBaseApis(page: Page) {
  let reorderPayload:
    | Array<{
        id: number;
        order: number;
      }>
    | undefined;

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
        projects,
      },
    });
  });

  await page.route(/\/(?:api\/)?notifications\/unread_count\/?$/, async (route) => {
    await route.fulfill({ json: { count: 0 } });
  });

  await page.route(/\/(?:api\/)?notifications\/?$/, async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.route(/\/api\/tasks\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: { count: 0, next: null, previous: null, results: [] },
    });
  });

  await page.route(/\/api\/projects\/?(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      json: { count: projects.length, next: null, previous: null, results: projects },
    });
  });

  await page.route(/\/(?:api\/)?projects\/bulk_update\/?$/, async (route) => {
    reorderPayload = route.request().postDataJSON();
    await route.fulfill({ json: reorderPayload });
  });

  return {
    getReorderPayload: () => reorderPayload,
  };
}

async function dragDownOneStep(source: ReturnType<Page["locator"]>) {
  await source.focus();
  await source.press("Space");
  await source.press("ArrowDown");
  await source.press("Space");
}

test.describe("Drag sorting", () => {
  test("reorders sidebar projects and persists new order", async ({ page }) => {
    const api = await mockBaseApis(page);

    await page.goto("/projects");
    await page.getByRole("button", { name: "expand projects list" }).click();

    const sidebarNav = page.getByRole("navigation");
    const alphaItem = sidebarNav.getByRole("button", {
      name: "Alpha project options",
    });
    const betaItem = sidebarNav.getByRole("button", {
      name: "Beta project options",
    });
    await expect(alphaItem).toBeVisible();
    await expect(betaItem).toBeVisible();

    await dragDownOneStep(alphaItem);

    await expect
      .poll(() => api.getReorderPayload(), { timeout: 10_000 })
      .toBeTruthy();

    const payload = api.getReorderPayload()!;
    const alpha = payload.find((project) => project.id === 2);
    const beta = payload.find((project) => project.id === 3);

    expect(alpha).toBeDefined();
    expect(beta).toBeDefined();
    expect(alpha!.order).toBeGreaterThan(beta!.order);
  });

});
