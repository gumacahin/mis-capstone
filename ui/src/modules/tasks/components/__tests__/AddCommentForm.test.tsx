import type { Task } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AddCommentForm from "../AddCommentForm";

const { mockAddComment, mockToastPromise } = vi.hoisted(() => ({
  mockAddComment: vi.fn(),
  mockToastPromise: vi.fn((promise: Promise<unknown>) => promise),
}));

vi.mock("@shared/hooks/queries", () => {
  return {
    useAddComment: () => ({
      mutateAsync: mockAddComment,
    }),
  };
});

vi.mock("react-hot-toast", () => ({
  default: {
    promise: mockToastPromise,
  },
}));

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test description",
  completion_date: null,
  priority: "NONE",
  section: 1,
  project: 1,
  project_title: "Test Project",
  tags: ["Test Tag"],
  order: 1,
  rrule: null,
  dtstart: null,
  anchor_mode: null,
  comments_count: 0,
  due_date: null,
};

interface MutationOptions {
  onSettled?: () => void;
  onSuccess?: () => void;
}

describe("AddCommentForm", () => {
  beforeEach(() => {
    mockAddComment.mockReset();
    mockAddComment.mockImplementation(
      async (_comment: unknown, options?: MutationOptions) => {
        options?.onSuccess?.();
        options?.onSettled?.();
        return {};
      },
    );
    mockToastPromise.mockClear();
  });

  it("should render input and allow text entry, then call onSubmit with comment", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AddCommentForm task={mockTask} userDisplayName="Test User" />
      </QueryClientProvider>,
    );

    const input = screen.getByPlaceholderText("Comment");
    expect(input).toBeInTheDocument();

    await userEvent.click(input);
    const realInput = screen.getByLabelText("Comment");
    await userEvent.type(realInput, "My test comment");
    expect(realInput).toHaveValue("My test comment");

    const button = screen.getByRole("button", { name: /add comment/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(mockAddComment).toHaveBeenCalled();
  });

  it("should clear input after submit", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AddCommentForm task={mockTask} userDisplayName="Test User" />
      </QueryClientProvider>,
    );
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Some text");
    const button = screen.getByRole("button", { name: /add comment/i });
    await userEvent.click(button);
    expect(input).toHaveValue("");
  });

  it.skip("should not submit empty comments", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AddCommentForm task={mockTask} userDisplayName="Test User" />
      </QueryClientProvider>,
    );
    const input = screen.getByPlaceholderText("Comment");
    await userEvent.click(input);
    expect(input).toHaveValue("");
    const button = screen.getByRole("button", { name: /add comment/i });
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });
});
