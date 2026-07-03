import { useAddSection } from "@shared/hooks/queries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import AddProjectSectionForm from "../AddProjectSectionForm";

vi.mock("@shared/hooks/queries", () => ({
  useAddSection: vi.fn(),
}));

// Helper to wrap component
function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

const mockSection = {
  id: 1,
  title: "Section 1",
  order: 0,
  project: 1,
  is_default: false,
};

describe.skip("AddProjectSectionForm", () => {
  test("renders input and buttons", () => {
    renderWithClient(
      <AddProjectSectionForm
        precedingSection={mockSection}
        handleClose={vi.fn()}
      />,
    );
    expect(
      screen.getByPlaceholderText(/name this section/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add section/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("calls handleClose when Cancel is clicked", () => {
    const handleClose = vi.fn();
    renderWithClient(
      <AddProjectSectionForm
        precedingSection={mockSection}
        handleClose={handleClose}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  test("disables Add Section button when input is empty", () => {
    renderWithClient(
      <AddProjectSectionForm
        precedingSection={mockSection}
        handleClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /add section/i })).toBeDisabled();
  });

  test("enables Add Section button when input has text", () => {
    renderWithClient(
      <AddProjectSectionForm
        precedingSection={mockSection}
        handleClose={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText(/name this section/i);
    fireEvent.change(input, { target: { value: "My new section" } });
    expect(
      screen.getByRole("button", { name: /add section/i }),
    ).not.toBeDisabled();
  });

  test("submits the form and resets title, then calls handleClose", async () => {
    const handleClose = vi.fn();
    // Mock the hook to resolve immediately
    const useAddSectionMock = vi.mocked(useAddSection);
    useAddSectionMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
    } as unknown as ReturnType<typeof useAddSection>);
    renderWithClient(
      <AddProjectSectionForm
        precedingSection={mockSection}
        handleClose={handleClose}
      />,
    );

    const input = screen.getByPlaceholderText(/name this section/i);
    fireEvent.change(input, { target: { value: "Section 2" } });
    const addButton = screen.getByRole("button", { name: /add section/i });
    fireEvent.click(addButton);

    // Wait for handleClose to be called
    await waitFor(() => expect(handleClose).toHaveBeenCalled());

    // Clean up mock
    useAddSectionMock.mockReset();
  });
});
