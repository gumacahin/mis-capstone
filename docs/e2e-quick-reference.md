# E2E Testing Quick Reference

## Essential Commands

```bash
# Start/Stop
make e2e-up          # Start E2E environment
make e2e-down        # Stop E2E environment
make e2e-status      # Check status

# Database
make e2e-reset       # Reset to baseline
make e2e-seed scenario=<name>  # Seed with scenario
```

## Test Endpoints

```bash
# Health check
curl http://localhost:8000/test/health

# Get test JWT
curl -X POST http://localhost:8000/test/login \
  -H "Content-Type: application/json" \
  -d '{"email": "e2e.user@example.com", "roles": ["user"]}'

# Create user (requires JWT)
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/test/warmup

# Reset database
curl -X POST http://localhost:8000/test/reset \
  -H "Content-Type: application/json" \
  -d '{"scenario": "baseline_empty_user"}'
```

## Environment Variables

```bash
# Test mode enabled when .e2e exists
E2E_TEST_MODE=1
DJANGO_ALLOW_TEST_ENDPOINTS=1
VITE_APP_ENV=e2e
VITE_E2E_BYPASS_AUTH=1
```

## Ports

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Test endpoints**: http://localhost:8000/test/\*

## JWT Details

- **Algorithm**: HS256
- **Expiration**: 2 minutes
- **Issuer**: https://e2e-test.upoutodo.local
- **Audience**: upoutodo-e2e

## Frontend Helpers

```typescript
// Available when VITE_APP_ENV=e2e
window.e2e.login(email); // Login with test user
window.e2e.reset(scenario); // Reset database
window.e2e.logout(); // Clear token
window.e2e.getToken(); // Get current token
window.e2e.isEnabled(); // Check if E2E mode
```

## Troubleshooting

```bash
# Kill processes
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Check logs
tail -f tmp/backend.log
tail -f tmp/frontend.log

# Verify environment
make e2e-status
```
