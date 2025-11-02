import { expect, test } from "@playwright/test";

test.describe("Application Loading", () => {
  test("should load the application without critical errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    const consoleMessages: string[] = [];

    // Capture console errors
    page.on("pageerror", (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleMessages.push(`Console Error: ${msg.text()}`);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should not have critical errors that break the app
    const criticalErrors = errors.filter(
      (error) =>
        error.includes("ReferenceError") ||
        error.includes("TypeError") ||
        error.includes("SyntaxError"),
    );

    expect(criticalErrors).toHaveLength(0);

    // Basic page structure should be present
    await expect(page.locator("#root")).toBeVisible();
  });

  test("should have correct page title and meta tags", async ({ page }) => {
    await page.goto("/");

    // Check page title (from your existing test)
    await expect(page).toHaveTitle(/What should I do today\?/i);

    // Check viewport meta tag (from your existing test)
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );
  });

  test("should handle slow network conditions", async ({ page }) => {
    // Simulate slow network
    await page.route("**/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      await route.continue();
    });

    await page.goto("/");

    // Should still load successfully, just slower
    await expect(page.locator("#root")).toBeVisible({ timeout: 15000 });
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should still show content on mobile
    await expect(page.locator("#root")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should still show content on desktop
    await expect(page.locator("#root")).toBeVisible();
  });
});
