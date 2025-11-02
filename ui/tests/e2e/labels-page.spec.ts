import { expect, test } from "@playwright/test";

test.describe("Labels Page", () => {
  test("should navigate to labels", async ({ page }) => {
    await page.goto("/labels");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/labels/);
    const main = page.getByRole("main");
    await expect(
      main.getByRole("heading", { level: 2, name: "My Labels" }),
    ).toBeVisible();
  });
});
