import { expect, test } from "@playwright/test";

test.describe("Upcoming Page - Basic Functionality", () => {
  test("should verify basic upcoming page functionality", async ({ page }) => {
    await page.goto("/upcoming");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/upcoming/);
    await expect(page.locator("#root")).toBeVisible();
  });
});
