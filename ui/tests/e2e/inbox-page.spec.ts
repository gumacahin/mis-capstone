import { expect, test } from "@playwright/test";

test.describe("Inbox Page", () => {
  test("should navigate to inbox", async ({ page }) => {
    await page.goto("/inbox");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/inbox/);
    // const main = page.getByRole("main");
    // await expect(
    //   main.getByRole("heading", { level: 2, name: "Inbox" }),
    // ).toBeVisible();
  });
});
