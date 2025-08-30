# Test Configuration

This directory contains the test configuration and utilities for the Vitest test suite.

## Files

- **`setup.ts`** - Global test setup including:

  - jsdom environment configuration
  - jest-dom matchers
  - Polyfills for `matchMedia` and `ResizeObserver`
  - Global mocks for Auth0, react-router-dom, and timers

- **`test-utils.tsx`** - Test utilities including:
  - `renderWithProviders` - Custom render function with Material-UI theme provider
  - Re-exports from `@testing-library/react` and `vitest`

## Usage

### In your test files:

```tsx
import {
  renderWithProviders,
  screen,
  describe,
  it,
  expect,
} from "../../../test/test-utils";

describe("MyComponent", () => {
  it("should render with theme", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### The renderWithProviders function:

- Automatically wraps components with Material-UI theme provider
- Includes CssBaseline for consistent styling
- Supports custom theme options
- Provides all testing-library utilities

## Configuration

The test setup is configured in `vitest.config.ts` to use:

- jsdom environment for DOM testing
- This setup file for global configuration
- 10 second timeout for tests
- Coverage reporting with v8 provider

