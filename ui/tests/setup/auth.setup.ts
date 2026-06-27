// tests/setup/auth.setup.ts
import fs from "node:fs";

import { expect, test } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const appOrigin =
  process.env.PLAYWRIGHT_BASE_URL ??
  `http://localhost:${process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? 3000}`;
const authStoragePrefix = "@@auth0spajs@@::";

type StoredCookie = {
  domain?: string;
  expires?: number;
};

type StoredLocalStorageItem = {
  name: string;
  value: string;
};

type StoredOrigin = {
  origin: string;
  localStorage?: StoredLocalStorageItem[];
};

type StorageState = {
  cookies?: StoredCookie[];
  origins?: StoredOrigin[];
};

function readStorageState(): StorageState {
  return JSON.parse(fs.readFileSync(authFile, "utf-8")) as StorageState;
}

function isE2EBypassEnabled(): boolean {
  if (process.env.VITE_E2E_BYPASS_AUTH === "1") return true;
  if (!fs.existsSync(".env.local")) return false;
  return fs
    .readFileSync(".env.local", "utf-8")
    .split(/\r?\n/)
    .some((line) => line.trim() === "VITE_E2E_BYPASS_AUTH=1");
}

function hasUsableState(): boolean {
  if (!fs.existsSync(authFile)) return false;
  try {
    const state = readStorageState();
    const now = Math.floor(Date.now() / 1000);
    // If at least one cookie for localhost is still valid, assume the session is good.
    return (state.cookies ?? []).some(
      (cookie) =>
        (cookie.domain === "localhost" || cookie.domain === ".localhost") &&
        (cookie.expires === -1 || (cookie.expires ?? 0) > now + 60), // -1 = session cookie; or not expiring soon
    );
  } catch {
    return false;
  }
}

function hasUsableE2EState(): boolean {
  if (!fs.existsSync(authFile)) return false;
  try {
    const state = readStorageState();
    const origin = (state.origins ?? []).find((item) => {
      return item.origin === appOrigin;
    });
    const localStorageItems = origin?.localStorage ?? [];
    const hasAccessToken = localStorageItems.some((item) => {
      if (!item.name.startsWith(authStoragePrefix)) return false;
      if (item.name.endsWith("::@@user@@")) return false;
      try {
        return Boolean(JSON.parse(item.value).body?.access_token);
      } catch {
        return false;
      }
    });
    const hasUser = localStorageItems.some((item) => {
      if (!item.name.startsWith(authStoragePrefix)) return false;
      if (!item.name.endsWith("::@@user@@")) return false;
      try {
        return Boolean(JSON.parse(item.value).email);
      } catch {
        return false;
      }
    });
    return hasAccessToken && hasUser;
  } catch {
    return false;
  }
}

function saveE2EState(): void {
  fs.mkdirSync("playwright/.auth", { recursive: true });
  const now = Math.floor(Date.now() / 1000);
  const clientId = process.env.VITE_AUTH0_CLIENT_ID ?? "e2e-client";
  const audience = process.env.VITE_AUTH0_AUDIENCE ?? "http://todoappdev/api";
  const userEmail = process.env.AUTH0_USERNAME ?? "e2e-user@example.test";

  const state = {
    cookies: [
      {
        name: "e2e-auth",
        value: "1",
        domain: "localhost",
        path: "/",
        expires: now + 86400,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ],
    origins: [
      {
        origin: appOrigin,
        localStorage: [
          {
            name: `${authStoragePrefix}${clientId}::${audience}::openid profile email`,
            value: JSON.stringify({
              body: {
                access_token: "e2e-token",
                scope: "openid profile email",
                expires_in: 86400,
                token_type: "Bearer",
                audience,
                client_id: clientId,
              },
              expiresAt: now + 86400,
            }),
          },
          {
            name: `${authStoragePrefix}${clientId}::@@user@@`,
            value: JSON.stringify({
              email: userEmail,
              email_verified: true,
              name: "Todo User",
              nickname: "todo user",
              sub: "auth0|e2e-user",
            }),
          },
          {
            name: "upoutodo.todayView",
            value: '"list"',
          },
        ],
      },
    ],
  };

  fs.writeFileSync(authFile, JSON.stringify(state, null, 2));
}

test("authenticate", async ({ page }) => {
  if (isE2EBypassEnabled()) {
    if (hasUsableE2EState()) {
      console.log("[setup] Reusing existing E2E auth state — skipping login");
      return;
    }
    saveE2EState();
    console.log("[setup] Saved E2E auth state to", authFile);
    return;
  }

  if (hasUsableState()) {
    console.log("[setup] Reusing existing auth state — skipping login");
    return;
  }

  console.log("[setup] No valid auth state — performing login");
  await page.goto(`${appOrigin}/login`);

  const username = process.env.AUTH0_USERNAME!;
  const password = process.env.AUTH0_PASSWORD!;

  await page.getByLabel(/email|username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /log in|continue|submit/i }).click();

  // Wait until app has redirected back and a signed-in signal is visible
  await page.waitForURL(`${appOrigin}/**`);
  await expect(page.getByText(/todo user/i)).toBeVisible();

  await page.context().storageState({ path: authFile });
  console.log("[setup] Saved storageState to", authFile);
});
