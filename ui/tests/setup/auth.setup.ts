// tests/setup/auth.setup.ts
import fs from "node:fs";

import { expect, test } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

function hasUsableState(): boolean {
  if (!fs.existsSync(authFile)) return false;
  try {
    const state = JSON.parse(fs.readFileSync(authFile, "utf-8"));
    const now = Math.floor(Date.now() / 1000);
    // If at least one cookie for localhost is still valid, assume the session is good.
    return (state.cookies || []).some(
      (c: any) =>
        (c.domain === "localhost" || c.domain === ".localhost") &&
        (c.expires === -1 || c.expires > now + 60), // -1 = session cookie; or not expiring soon
    );
  } catch {
    return false;
  }
}

test("authenticate", async ({ page }) => {
  if (hasUsableState()) {
    console.log("[setup] Reusing existing auth state — skipping login");
    return;
  }

  console.log("[setup] No valid auth state — performing login");
  await page.goto("http://localhost:3000/login");

  const username = process.env.AUTH0_USERNAME!;
  const password = process.env.AUTH0_PASSWORD!;

  await page.getByLabel(/email|username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /log in|continue|submit/i }).click();

  // Wait until app has redirected back and a signed-in signal is visible
  await page.waitForURL("http://localhost:3000/**");
  await expect(page.getByText(/todo user/i)).toBeVisible();

  await page.context().storageState({ path: authFile });
  console.log("[setup] Saved storageState to", authFile);
});
