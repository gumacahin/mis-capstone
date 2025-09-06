/* eslint-disable react-refresh/only-export-components */
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";

// Create a custom theme for testing
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

// Custom render function that includes MUI theme and React Query
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything except render to avoid conflicts
export {
  act,
  cleanup,
  findAllByLabelText,
  findAllByRole,
  findAllByTestId,
  findAllByText,
  findByLabelText,
  findByRole,
  findByTestId,
  findByText,
  fireEvent,
  getAllByLabelText,
  getAllByRole,
  getAllByTestId,
  getAllByText,
  getByLabelText,
  getByRole,
  getByTestId,
  getByText,
  queryAllByLabelText,
  queryAllByRole,
  queryAllByTestId,
  queryAllByText,
  queryByLabelText,
  queryByRole,
  queryByTestId,
  queryByText,
  renderHook,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
export { customRender as render };
