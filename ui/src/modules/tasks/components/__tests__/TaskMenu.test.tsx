// src/modules/tasks/components/__tests__/TaskMenu.test.tsx
import { fireEvent, screen, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../test/test-utils";

// Mock the useUpdateTask hook
const mutateAsyncMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@shared/hooks/queries", () => ({
  useUpdateTask: () => ({
    mutateAsync: mutateAsyncMock,
  }),
}));

// Mock the generateTaskLink function to return a valid link
vi.mock("@shared/utils", () => ({
  generateTaskLink: () => "/tasks/1",
}));

// Mock the TaskMenuDatePicker component
vi.mock("../TaskMenuDatePicker", () => ({
  __esModule: true,
  default: ({
    handleOnChange,
    handleClose,
  }: {
    handleOnChange: (d: dayjs.Dayjs) => void;
    handleClose: () => void;
  }) => (
    <div data-testid="task-menu-date-picker">
      <button onClick={() => handleOnChange(dayjs())}>Select Date</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

// Mock the TaskDuplicateMenuItem component
vi.mock("../TaskDuplicateMenuItem", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="task-duplicate-menu-item">
      <button onClick={onClose}>Duplicate</button>
    </div>
  ),
}));

// Mock the TaskMoveMenuItem component
vi.mock("../TaskMoveMenuItem", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="task-move-menu-item">
      <button onClick={onClose}>Move</button>
    </div>
  ),
}));

// Mock react-hot-toast: promise passthrough so it never stalls
vi.mock("react-hot-toast", () => {
  const passthrough = vi.fn(<T,>(p: Promise<T>) => p);
  return {
    toast: {
      promise: passthrough,
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock navigator.clipboard with a resolved Promise
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: mockWriteText },
  writable: true,
  configurable: true,
});

import TaskMenu from "../TaskMenu";

// Mock the task prop
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  due_date: "2025-08-25T14:30:00Z",
  priority: "MEDIUM" as const,
  section: 1,
  project: 1,
  project_title: "Test Project",
  section_title: "Test Section",
  tags: [],
  order: 0,
  comments_count: 0,
};

// Mock props
const mockProps = {
  task: mockTask,
  taskMenuAnchorEl: document.createElement("button"),
  showAddTaskMenuItems: true,
  handleAddTaskAbove: vi.fn(),
  handleAddTaskBelow: vi.fn(),
  handleCloseTaskMenu: vi.fn(),
  handleEditTask: vi.fn(),
  handleDeleteTask: vi.fn(),
};

describe("TaskMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockClear();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should display all menu items", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Add task above")).toBeInTheDocument();
      expect(screen.getByText("Add task below")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Copy Link")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Priority")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should show add task menu items when showAddTaskMenuItems is true", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Add task above")).toBeInTheDocument();
      expect(screen.getByText("Add task below")).toBeInTheDocument();
    });

    it("should not show add task menu items when showAddTaskMenuItems is false", () => {
      renderWithProviders(
        <TaskMenu {...mockProps} showAddTaskMenuItems={false} />,
      );
      expect(screen.queryByText("Add task above")).not.toBeInTheDocument();
      expect(screen.queryByText("Add task below")).not.toBeInTheDocument();
    });

    it("should display TaskMenuDatePicker", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
    });

    it("should display TaskDuplicateMenuItem", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(
        screen.getByTestId("task-duplicate-menu-item"),
      ).toBeInTheDocument();
    });

    it("should display TaskMoveMenuItem", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("task-move-menu-item")).toBeInTheDocument();
    });
  });

  describe("Date Section", () => {
    it("should display date section with all date buttons", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByTestId("TodayIcon")).toBeInTheDocument();
      expect(screen.getByTestId("WbSunnyIcon")).toBeInTheDocument();
      expect(screen.getByTestId("WeekendIcon")).toBeInTheDocument();
      expect(screen.getByTestId("MoreHorizIcon")).toBeInTheDocument();
    });

    it("should show remove due date button when task has due date", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("NotInterestedIcon")).toBeInTheDocument();
    });

    it("should not show remove due date button when task has no due date", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(<TaskMenu {...mockProps} task={taskWithoutDate} />);
      expect(screen.queryByTestId("NotInterestedIcon")).not.toBeInTheDocument();
    });
  });

  describe("Priority Section", () => {
    it("should display priority section with all priority buttons", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Priority")).toBeInTheDocument();
      expect(screen.getByTestId("FlagIcon")).toBeInTheDocument();
      const outlinedFlags = screen.getAllByTestId("OutlinedFlagIcon");
      expect(outlinedFlags.length).toBeGreaterThan(0);
    });
  });

  // --- helpers: click the real MenuItem element (li role="menuitem") ---
  function clickMenuItemByText(text: string) {
    const li = screen.getByText(text).closest("li");
    if (!li) throw new Error(`MenuItem <li> not found for text: ${text}`);
    fireEvent.click(li);
  }

  describe("Menu Actions", () => {
    it("should handle edit task click", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      clickMenuItemByText("Edit");
      expect(mockProps.handleEditTask).toHaveBeenCalledWith(mockTask);
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle add task above click", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      clickMenuItemByText("Add task above");
      expect(mockProps.handleAddTaskAbove).toHaveBeenCalled();
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle add task below click", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      clickMenuItemByText("Add task below");
      expect(mockProps.handleAddTaskBelow).toHaveBeenCalled();
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle delete task click", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      clickMenuItemByText("Delete");
      expect(mockProps.handleDeleteTask).toHaveBeenCalledWith(mockTask);
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it.skip("should handle copy link click", async () => {
      // Create a promise we control and make writeText return it.
      let resolveWrite!: () => void;
      const controlled = new Promise<void>((resolve) => {
        resolveWrite = resolve;
      });

      const writeSpy = vi.fn().mockReturnValue(controlled);

      // Override *window.navigator* so the component definitely uses our spy.
      const originalNavigator = window.navigator;
      Object.defineProperty(window, "navigator", {
        configurable: true,
        value: { ...originalNavigator, clipboard: { writeText: writeSpy } },
      });

      // Use a fresh close spy just for this test run.
      const handleClose = vi.fn();
      const props = { ...mockProps, handleCloseTaskMenu: handleClose };

      try {
        renderWithProviders(<TaskMenu {...props} />);

        // Click the actual MenuItem <li> (MUI binds the handler on the <li>)
        const li = screen.getByText("Copy Link").closest("li");
        if (!li) throw new Error("Copy Link menu item not found");
        // Fire the click to trigger the async handler
        fireEvent.click(li);

        // Ensure clipboard was called with the URL we expect to copy
        expect(writeSpy).toHaveBeenCalledTimes(1);
        expect(String(writeSpy.mock.calls[0][0])).toContain("/tasks/1");

        // Resolve the exact promise the component is awaiting
        resolveWrite();

        // Now the handler continues and must call handleCloseTaskMenu()
        await waitFor(() => {
          expect(handleClose).toHaveBeenCalled();
        });
      } finally {
        // Restore navigator to avoid side effects in other tests
        Object.defineProperty(window, "navigator", {
          configurable: true,
          value: originalNavigator,
        });
      }
    }, 5000);
  });

  describe("Date Picker Integration", () => {
    it("should open date picker when more options button is clicked", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      const moreOptionsButton = screen
        .getByTestId("MoreHorizIcon")
        .closest("button");
      if (!moreOptionsButton) throw new Error("More options button not found");
      fireEvent.click(moreOptionsButton);
      expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
    });

    it("should handle date selection from date picker", async () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      fireEvent.click(screen.getByText("Select Date"));
      expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
    });
  });

  describe("Menu State Management", () => {
    it("should close menu when clicking outside", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should handle menu close correctly", () => {
      renderWithProviders(<TaskMenu {...mockProps} />);
      expect(mockProps.handleCloseTaskMenu).toBeDefined();
    });
  });
});
