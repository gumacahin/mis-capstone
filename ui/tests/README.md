# E2E Testing Guide

This guide explains how to run and write e2e tests for the UPOU Todo application.

## Quick Start

```bash
# Run all e2e tests
make test:e2e

# Run specific test file
make test:e2e ARGS="home.spec.ts"

# Run tests in headed mode (see browser)
make test:e2e ARGS="--headed"

# Run specific test with options
make test:e2e ARGS="auth-integration.spec.ts --headed"
```

## Test Categories

### 1. **Public Tests** (No Authentication Required)

These tests work without authentication and test public functionality:

- `home.spec.ts` - Home page functionality
- `navigation.spec.ts` - Public navigation
- `auth-integration.spec.ts` - Authentication redirects

### 2. **Authenticated Tests** (Require Authentication)

These tests need authentication to access protected routes:

- `upcoming-page-basic.spec.ts` - Upcoming page functionality
- `app-loading-programmatic.spec.ts` - App loading with auth
- `system-working.spec.ts` - System verification

## Authentication Approach

### **Backend Authentication**

We use a **backend authentication approach** that:

1. Calls `/api/test-auth/login` to get real tokens
2. Sets up proper Auth0 localStorage state
3. Provides consistent authentication across all tests

### **Automatic Setup**

Most tests inherit authentication automatically from `auth.setup.ts`. No per-test auth code needed!

### **Manual Authentication (When Needed)**

For tests that need specific authentication:

```typescript
import { setupBackendAuth } from "../helpers/auth-setup";

test("my authenticated test", async ({ page }) => {
  // Set up authentication
  await setupBackendAuth(page);

  // Now you can access protected routes
  await page.goto("/today");
  // Test continues...
});
```

### **Admin Authentication**

```typescript
await setupBackendAuth(page, { role: "admin" });
```

### **Clear Authentication**

```typescript
import { clearAuth } from "../helpers/auth-setup";

await clearAuth(page); // Test unauthenticated scenarios
```

## Writing New Tests

### **For Public Functionality**

```typescript
import { test, expect } from "@playwright/test";

test("my public test", async ({ page }) => {
  await page.goto("/");
  // Test public functionality
});
```

### **For Protected Functionality**

```typescript
import { test, expect } from "@playwright/test";
import { setupBackendAuth } from "../helpers/auth-setup";

test("my protected test", async ({ page }) => {
  await setupBackendAuth(page);
  await page.goto("/protected-route");
  // Test authenticated functionality
});
```

## Test Structure

```
ui/tests/
├── e2e/                    # E2E test files
│   ├── home.spec.ts        # Public tests
│   ├── auth-integration.spec.ts
│   ├── upcoming-page-basic.spec.ts  # Authenticated tests
│   └── system-working.spec.ts
├── helpers/
│   └── auth-setup.ts       # Authentication helpers
├── setup/
│   └── auth.setup.ts       # Global test setup
└── README.md              # This file
```

## Backend Requirements

The e2e tests require the backend to be running with the test authentication endpoint:

- **Endpoint**: `POST /api/test-auth/login`
- **Purpose**: Creates test users and returns Auth0-compatible tokens
- **Security**: Only available in development/test mode

## Expected Behaviors

### **Authenticated Tests**

- Should access protected routes without redirects
- Should see authenticated content
- Should have proper user state

### **Unauthenticated Tests**

- Should redirect to Auth0 for protected routes
- Should show public content for public routes
- Should handle auth redirects gracefully

## Troubleshooting

### **Tests Redirecting to Auth0**

This is **expected behavior** for:

- Tests that don't use `setupBackendAuth()`
- Tests that explicitly clear authentication
- Tests designed to test auth redirects

### **Authentication Not Working**

1. Check that backend is running (`http://localhost:8000`)
2. Verify `/api/test-auth/login` endpoint is available
3. Check console logs for auth setup messages

### **Tests Failing**

1. Run with `--headed` to see what's happening
2. Check browser console for errors
3. Verify test expectations match actual behavior

## Performance Tips

- **Group similar tests** - Put authenticated tests together
- **Use setup efficiently** - Don't re-authenticate unnecessarily
- **Parallel execution** - Tests run in parallel by default
- **Selective running** - Use `ARGS` to run specific tests during development

## Examples

```bash
# Development workflow
make test:e2e ARGS="upcoming-page-basic.spec.ts --headed"

# CI/Production
make test:e2e

# Debug specific functionality
make test:e2e ARGS="auth --headed"  # All auth-related tests
```

---

**The e2e testing system is designed to be simple, reliable, and maintainable. Most tests should "just work" without complex setup!** 🎯
