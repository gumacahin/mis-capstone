import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import { Tag } from "@/modules/shared";

import LabelContextProvider from "../LabelContextProvider";

const fakeLabel: Tag = {
  name: "Test Label",
};

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <LabelContextProvider label={fakeLabel}>{ui}</LabelContextProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("LabelContextProvider", () => {
  test("renders children", () => {
    renderWithClient(<div>Test LabelContext Child</div>);
    expect(screen.getByText("Test LabelContext Child")).toBeInTheDocument();
  });
});
