# E2E Testing Environment Setup & Usage

This document describes how to set up and use the E2E (End-to-End) testing environment for the UPOU Todo application.

## Overview

The E2E testing environment provides a hermetic, isolated testing setup that:

- Bypasses real third-party authentication (Auth0) during testing
- Uses throwaway data (SQLite) with short TTL JWT tokens
- Provides test-only utility endpoints for managing test state
- Exercises the same backend code paths as production (JWT → RemoteUserBackend → post_save signals)

## Prerequisites

- Python 3.13+ with `uv` package manager
- Node.js 18+ with `npm`
- `direnv` for environment management
- `make` for automation
- `curl` and `jq` for testing endpoints

## Quick Start

### 1. Start E2E Environment

```bash
# Start the complete E2E environment (backend + frontend)
make e2e-up
```

This will:

- Create `.e2e` sentinel file to enable test mode
- Start Django backend on port 8000 with test settings
- Start Vite frontend on port 3000
- Wait for both services to be ready
- Display status and log file locations

### 2. Verify Environment

```bash
# Check environment status
make e2e-status

# Test backend health
curl http://localhost:8000/test/health | jq .

# Test frontend
curl http://localhost:3000 | head -20
```

### 3. Stop E2E Environment

```bash
# Stop and clean up the E2E environment
make e2e-down
```

## Environment Configuration

### Test Mode Toggle

The E2E environment is controlled by the `.e2e` sentinel file:

- **Create `.e2e`**: Enables test mode automatically via `.envrc`
- **Remove `.e2e`**: Disables test mode and returns to normal development

### Environment Variables

When test mode is enabled (`.e2e` exists), these variables are automatically set:

```bash
E2E_TEST_MODE=1
DJANGO_ALLOW_TEST_ENDPOINTS=1
VITE_APP_ENV=e2e
VITE_E2E_BYPASS_AUTH=1
JWT_TEST_ISSUER=https://e2e-test.upoutodo.local
JWT_TEST_AUDIENCE=upoutodo-e2e
JWT_TEST_SIGNING_KEY=<secure-random-key>
EMAIL_FILE_PATH=$PWD/tmp/test-emails
```

## Test Endpoints

### Authentication

#### `POST /test/login`

Creates a test JWT token for E2E testing.

**Request:**

```json
{
  "email": "e2e.user@example.com",
  "roles": ["user"]
}
```

**Response:**

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.test.token.placeholder",
  "refresh": null,
  "claims": {
    "iss": "https://e2e-test.upoutodo.local",
    "aud": "upoutodo-e2e",
    "sub": "auth0|e2e_user_at_example_com",
    "email": "e2e.user@example.com",
    "roles": ["user"]
  }
}
```

#### `GET /test/warmup` (Authenticated)

Triggers user creation via normal auth flow. This endpoint:

- Requires a valid test JWT
- Triggers RemoteUserBackend → post_save signals
- Creates User, UserProfile, and default Inbox project

**Response:**

```json
{
  "ok": true,
  "user_id": 1
}
```

### Database Management

#### `POST /test/reset`

Resets the database to a clean state.

**Request:**

```json
{
  "scenario": "baseline_empty_user"
}
```

**Response:**

```json
{
  "ok": true,
  "scenario": "baseline_empty_user",
  "tables_truncated": 14
}
```

#### `POST /test/seed`

Seeds the database with test data for specific scenarios.

**Request:**

```json
{
  "scenario": "today_with_overdue"
}
```

**Response:**

```json
{
  "ok": true,
  "scenario": "today_with_overdue",
  "created_ids": {
    "user_id": 2
  }
}
```

### Email Testing

#### `GET /test/email-dump`

Lists all emails sent during test mode.

**Response:**

```json
{
  "ok": true,
  "emails": [],
  "count": 0
}
```

#### `POST /test/email-clear`

Clears all test emails.

**Response:**

```json
{
  "ok": true,
  "cleared_count": 0
}
```

### Health Check

#### `GET /test/health`

Returns the current test environment configuration.

**Response:**

```json
{
  "debug": true,
  "e2E_test_mode": true,
  "allow_test_endpoints": true,
  "timestamp": "2025-08-25T08:19:13.566976"
}
```

## Make Targets

### Core Commands

```bash
# Start E2E environment
make e2e-up

# Stop E2E environment
make e2e-down

# Check environment status
make e2e-status

# View logs
make e2e-logs
```

### Database Management

```bash
# Reset database to baseline
make e2e-reset

# Seed database with specific scenario
make e2e-seed scenario=today_with_overdue
```

## JWT Configuration

### Test JWT Details

- **Algorithm**: HS256 (symmetric)
- **Issuer**: `https://e2e-test.upoutodo.local`
- **Audience**: `upoutodo-e2e`
- **Expiration**: 2 minutes (access), 10 minutes (refresh)
- **Signing Key**: Secure random 256-bit key

### JWT Flow

1. **Login**: Call `/test/login` to get a test JWT
2. **Authenticate**: Use JWT in `Authorization: Bearer <token>` header
3. **Warmup**: Call `/test/warmup` to trigger user creation
4. **Test**: Use the authenticated session for your E2E tests

## Frontend Integration

### E2E Bootstrap Module

The frontend automatically loads E2E helpers when `VITE_APP_ENV=e2e`:

```typescript
// Available globally when in E2E mode
window.e2e.login(email?: string): Promise<void>
window.e2e.reset(scenario?: string): Promise<void>
window.e2e.logout(): void
window.e2e.getToken(): string | null
window.e2e.isEnabled(): boolean
```

### Usage in Tests

```typescript
// Login with test user
await window.e2e.login("e2e.user@example.com");

// Reset database
await window.e2e.reset("baseline_empty_user");

// Get current token
const token = window.e2e.getToken();
```

## Test Scenarios

### Available Scenarios

- **`baseline_empty_user`**: Clean database with no test data
- **`today_with_overdue`**: User with overdue and due-today tasks
- **`inbox_with_unorganized`**: User with unorganized inbox tasks

### Creating Custom Scenarios

Add new scenarios in `api/testkit/views.py`:

```python
elif scenario == "custom_scenario":
    # Create test data
    user = User.objects.create_user(
        username="custom_user",
        email="custom@example.com",
        password="testpass123"
    )
    # Add more test data...
    created_ids["user_id"] = user.id
```

## Troubleshooting

### Common Issues

#### Backend Won't Start

```bash
# Check if port 8000 is in use
lsof -ti:8000 | xargs kill -9

# Check backend logs
tail -f tmp/backend.log
```

#### Frontend Won't Start

```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Check frontend logs
tail -f tmp/frontend.log
```

#### JWT Authentication Fails

```bash
# Check JWT configuration
curl http://localhost:8000/test/health | jq .

# Verify test JWT is valid
curl -H "Authorization: Bearer <token>" http://localhost:8000/test/warmup
```

#### Test Endpoints Return 404

```bash
# Verify environment variables
echo "E2E_TEST_MODE: $E2E_TEST_MODE"
echo "DJANGO_ALLOW_TEST_ENDPOINTS: $DJANGO_ALLOW_TEST_ENDPOINTS"

# Check Django settings
curl http://localhost:8000/test/health
```

### Debug Commands

```bash
# Check running processes
make e2e-status

# View all logs
make e2e-logs

# Test individual endpoints
curl http://localhost:8000/test/health
curl http://localhost:3000

# Check environment
env | grep -E "(E2E|DJANGO|VITE)"
```

## Security Notes

### Test-Only Features

- Test endpoints are **NEVER** exposed in production
- Multiple guard layers ensure test features are disabled:
  - `DEBUG = True`
  - `E2E_TEST_MODE = True`
  - `DJANGO_ALLOW_TEST_ENDPOINTS = "1"`
- Test JWT signing keys are separate from production
- Test endpoints return 404 when guards are not satisfied

### Environment Isolation

- Test database (`db_test.sqlite3`) is separate from development
- Test emails are written to local files, never sent
- Test JWT tokens have short TTL (2 minutes)
- All test data is throwaway and can be reset

## Next Steps

With the E2E environment working, you can now:

1. **Write Playwright Tests**: Use the stable `data-testid` selectors
2. **Test User Flows**: Login, user creation, profile setup
3. **Test API Integration**: Backend endpoints with test authentication
4. **Test Email Flows**: Verify reminder logic without sending emails
5. **Test JWT Expiry**: Short TTL tokens help test refresh flows

## Examples

### Complete E2E Test Flow

```bash
# 1. Start environment
make e2e-up

# 2. Verify environment
make e2e-status

# 3. Reset database
make e2e-reset

# 4. Test authentication
TOKEN=$(curl -s -X POST http://localhost:8000/test/login \
  -H "Content-Type: application/json" \
  -d '{"email": "e2e.user@example.com", "roles": ["user"]}' \
  | jq -r '.access')

# 5. Test user creation
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/test/warmup

# 6. Run your E2E tests...
# 7. Stop environment
make e2e-down
```

### Frontend E2E Test

```typescript
// In your Playwright test
test("user can login and see dashboard", async ({ page }) => {
  // E2E environment is already running
  await page.goto("http://localhost:3000");

  // Login using E2E helper
  await page.evaluate(() => {
    return window.e2e.login("e2e.user@example.com");
  });

  // Verify user is logged in
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```
