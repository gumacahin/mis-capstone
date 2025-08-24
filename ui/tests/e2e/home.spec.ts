import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the home page", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page title is correct
    await expect(page).toHaveTitle(/What should I do today\?/i);

    // Check that the main content is visible
    // This will depend on your actual home page structure
    // For now, we'll check for basic page elements
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check for React root element
    const root = page.locator("#root");
    await expect(root).toBeVisible();
  });

  test("should have proper meta tags", async ({ page }) => {
    await page.goto("/");

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );
  });
});
