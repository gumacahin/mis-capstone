# Testing Setup

This directory contains the testing configuration and utilities for the frontend application.

## Test Framework

- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing utilities
- **jsdom**: DOM environment for tests

## Configuration

### Vitest Config (`vitest.config.ts`)

- Configured for React components
- Uses jsdom environment
- Includes MUI theme and React Query providers
- Excludes Playwright e2e tests

### Test Setup (`setup.ts`)

- Configures jest-dom matchers
- Sets up cleanup after each test
- Mocks browser APIs (matchMedia, ResizeObserver, IntersectionObserver)

### Test Utils (`test-utils.tsx`)

- Custom render function with MUI theme provider
- React Query client for testing
- Re-exports all testing library utilities

## Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run e2e tests (Playwright)
npm run test:e2e
```

## Writing Tests

### Basic Component Test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "../test/test-utils";
import { Button } from "@mui/material";

describe("Button Component", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });
});
```

### Testing with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import DatePicker from "../modules/shared/components/DatePicker";

const TestWrapper = () => {
  const { control } = useForm({
    defaultValues: { dueDate: null },
  });

  return <DatePicker control={control} name="dueDate" />;
};
```

## Test Helpers

The `helpers.ts` file provides common testing utilities:

- Mock functions
- API response mocks
- User interaction helpers
- localStorage mocks
- window.location mocks

## MUI Component Testing

The test setup includes:

- MUI theme provider
- Emotion CSS support
- Proper cleanup between tests
- Accessibility testing utilities

## Best Practices

1. Use `screen` queries for finding elements
2. Test user interactions, not implementation details
3. Use `data-testid` for complex components
4. Test accessibility attributes
5. Mock external dependencies
6. Clean up after each test
