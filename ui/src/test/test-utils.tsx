import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { render, RenderOptions } from "@testing-library/react";
import React, { PropsWithChildren } from "react";

// Mock MUI X Date Pickers for tests
const MockLocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <div data-testid="localization-provider">{children}</div>;

// If your app uses a custom Emotion cache in production, you can optionally provide it here
// import createCache from '@emotion/cache'
// import { CacheProvider } from '@emotion/react'

export type ProvidersProps = {
  themeOptions?: ThemeOptions;
};

function AllProviders({
  children,
  themeOptions,
}: PropsWithChildren<ProvidersProps>) {
  const theme = createTheme({
    palette: { mode: "light", primary: { main: "#1976d2" } },
    ...themeOptions,
  });

  return (
    // If you use a custom Emotion cache in the app, mirror it here:
    // <CacheProvider value={createCache({ key: 'css', prepend: true })}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Mock MUI X Date Pickers for tests */}
      <MockLocalizationProvider>{children}</MockLocalizationProvider>
    </ThemeProvider>
  );
}

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & ProvidersProps;

export function renderWithProviders(
  ui: React.ReactElement,
  { themeOptions, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: (p) => <AllProviders {...p} themeOptions={themeOptions} />,
    ...options,
  });
}

// re-export everything from testing-library
export * from "@testing-library/react";

// re-export test functions from Vitest
export { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
