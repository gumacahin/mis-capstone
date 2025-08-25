#!/bin/bash

# E2E Environment Setup Verification Script
# This script verifies that the E2E testing environment is properly configured

set -e

echo "🔍 Verifying E2E Environment Setup..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "Makefile" ] || [ ! -f ".envrc" ]; then
    echo "❌ Error: Must run from project root directory"
    exit 1
fi

echo "✅ Project root directory confirmed"

# Check required tools
echo ""
echo "🔧 Checking required tools..."

command -v make >/dev/null 2>&1 || { echo "❌ Error: make is required but not installed"; exit 1; }
command -v uv >/dev/null 2>&1 || { echo "❌ Error: uv is required but not installed"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ Error: npm is required but not installed"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "❌ Error: curl is required but not installed"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ Error: jq is required but not installed"; exit 1; }

echo "✅ All required tools are available"

# Check if direnv is loaded
echo ""
echo "🌍 Checking environment configuration..."

if ! command -v direnv >/dev/null 2>&1; then
    echo "⚠️  Warning: direnv not found. Environment variables may not be set correctly."
else
    echo "✅ direnv is available"
fi

# Check if .envrc exists and is allowed
if [ -f ".envrc" ]; then
    echo "✅ .envrc file exists"
    if [ -f ".envrc.local" ]; then
        echo "✅ .envrc.local exists (direnv should be allowed)"
    else
        echo "⚠️  Warning: .envrc.local not found. Run 'direnv allow' to enable environment variables."
    fi
else
    echo "❌ Error: .envrc file not found"
    exit 1
fi

# Check if testkit app exists
echo ""
echo "🧪 Checking testkit app..."

if [ -d "api/testkit" ]; then
    echo "✅ testkit app directory exists"
    if [ -f "api/testkit/__init__.py" ] && [ -f "api/testkit/urls.py" ] && [ -f "api/testkit/views.py" ]; then
        echo "✅ testkit app files are present"
    else
        echo "❌ Error: testkit app files are incomplete"
        exit 1
    fi
else
    echo "❌ Error: testkit app directory not found"
    exit 1
fi

# Check if test settings exist
if [ -f "api/api/settings_test.py" ]; then
    echo "✅ Test settings file exists"
else
    echo "❌ Error: Test settings file not found"
    exit 1
fi

# Check if E2E scripts exist
echo ""
echo "📜 Checking E2E scripts..."

if [ -f "ui/src/scripts/e2e.ts" ]; then
    echo "✅ Frontend E2E script exists"
else
    echo "❌ Error: Frontend E2E script not found"
    exit 1
fi

# Check if test selectors are present
echo ""
echo "🎯 Checking test selectors..."

if grep -q 'data-testid="login-button"' ui/src/modules/auth/components/LoginButton.tsx; then
    echo "✅ Login button test selector found"
else
    echo "❌ Error: Login button test selector not found"
fi

if grep -q 'data-testid="user-menu"' ui/src/modules/views/components/AccountMenu.tsx; then
    echo "✅ User menu test selector found"
else
    echo "❌ Error: User menu test selector not found"
fi

# Check if tmp directory exists
echo ""
echo "📁 Checking directories..."

if [ -d "tmp" ]; then
    echo "✅ tmp directory exists"
else
    echo "⚠️  Warning: tmp directory not found. Will be created by make e2e-up"
fi

if [ -d "tmp/test-emails" ]; then
    echo "✅ test-emails directory exists"
else
    echo "⚠️  Warning: test-emails directory not found. Will be created by make e2e-up"
fi

# Check Makefile targets
echo ""
echo "⚙️  Checking Makefile targets..."

if grep -q "e2e-up:" Makefile; then
    echo "✅ e2e-up target found"
else
    echo "❌ Error: e2e-up target not found in Makefile"
    exit 1
fi

if grep -q "e2e-down:" Makefile; then
    echo "✅ e2e-down target found"
else
    echo "❌ Error: e2e-down target not found in Makefile"
    exit 1
fi

if grep -q "e2e-status:" Makefile; then
    echo "✅ e2e-status target found"
else
    echo "❌ Error: e2e-status target not found in Makefile"
    exit 1
fi

echo ""
echo "🎉 E2E Environment Setup Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Run 'make e2e-up' to start the E2E environment"
echo "2. Run 'make e2e-status' to verify both services are running"
echo "3. Test endpoints with: curl http://localhost:8000/test/health"
echo "4. Run 'make e2e-down' when done"
echo ""
echo "For detailed usage, see docs/e2e-testing.md"
