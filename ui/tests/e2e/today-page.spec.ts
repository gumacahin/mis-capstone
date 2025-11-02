import { expect, test } from "@playwright/test";

// import { loginWithAuth0 } from "../helpers/auth0-login";

test.describe("Today Page", () => {
  test("should navigate to today", async ({ page }) => {
    await page.goto("/today");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/today/);
    // const main = page.getByRole("main");
    // await expect(
    //   main.getByRole("heading", { level: 2, name: "Today" }),
    // ).toBeVisible();
  });
});
