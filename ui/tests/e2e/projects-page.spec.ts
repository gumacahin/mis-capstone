import { expect, test } from "@playwright/test";

test.describe("Projects Page - Basic Functionality", () => {
  test("should verify basic projects page functionality", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/projects/);
    const main = page.getByRole("main"); // or locator('main') if no landmark roles
    await expect(
      main.getByRole("heading", { level: 2, name: "My Projects" }),
    ).toBeVisible();
  });
});
