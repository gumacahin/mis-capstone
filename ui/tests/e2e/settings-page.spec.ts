import { expect, test } from "@playwright/test";

test.describe("Settings Page", () => {
  test("should navigate to settings", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/settings/);
    const main = page.getByRole("main");
    await expect(
      main.getByRole("heading", { level: 2, name: "Settings" }),
    ).toBeVisible();
  });
});
