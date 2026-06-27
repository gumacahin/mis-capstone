import { defineConfig } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const port = Number(process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? 3105);
const backendPort = Number(process.env.PLAYWRIGHT_BACKEND_PORT ?? 8000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const backendURL = `http://127.0.0.1:${backendPort}`;
const e2eUserEmail =
  process.env.E2E_USER_EMAIL ??
  process.env.AUTH0_USERNAME ??
  "planner-demo@example.test";
const e2eToken =
  process.env.E2E_BEARER_TOKEN ??
  process.env.VITE_E2E_ACCESS_TOKEN ??
  "e2e-token";
const backendEnv = [
  "DEBUG=True",
  "E2E_TEST_MODE=1",
  "DJANGO_ALLOW_TEST_ENDPOINTS=1",
  `E2E_USER_EMAIL=${e2eUserEmail}`,
  `E2E_BEARER_TOKEN=${e2eToken}`,
].join(" ");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 15000,
    actionTimeout: 8000,
    serviceWorkers: "block",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { storageState: authFile },
      dependencies: ["setup"],
    },
  ],
  webServer: [
    {
      command: [
        "cd ../api",
        `${backendEnv} uv run python manage.py migrate --noinput`,
        `${backendEnv} uv run python manage.py seed_planner_evaluation_demo --reset`,
        `${backendEnv} uv run python manage.py runserver 127.0.0.1:${backendPort}`,
      ].join(" && "),
      url: `${backendURL}/api/schema/`,
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: `VITE_APP_ENV=e2e VITE_E2E_BYPASS_AUTH=1 VITE_API_BASE_URL=${baseURL} VITE_API_PROXY_TARGET=${backendURL} npm run dev -- --host 127.0.0.1 --port ${port}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
