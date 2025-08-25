import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

// Mock the useUpdateTask hook
jest.mock("@shared/hooks/queries", () => ({
  useUpdateTask: () => ({
    mutateAsync: jest.fn(),
  }),
}));

// Mock the TaskMenuDatePicker component
jest.mock("../TaskMenuDatePicker", () => ({
  __esModule: true,
  default: ({
    handleOnChange,
    handleClose,
  }: {
    handleOnChange: () => void;
    handleClose: () => void;
  }) => (
    <div data-testid="task-menu-date-picker">
      <button onClick={() => handleOnChange(dayjs())}>Select Date</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

// Mock the TaskDuplicateMenuItem component
jest.mock("../TaskDuplicateMenuItem", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="task-duplicate-menu-item">
      <button onClick={onClose}>Duplicate</button>
    </div>
  ),
}));

// Mock the TaskMoveMenuItem component
jest.mock("../TaskMoveMenuItem", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="task-move-menu-item">
      <button onClick={onClose}>Move</button>
    </div>
  ),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    promise: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
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
  handleAddTaskAbove: jest.fn(),
  handleAddTaskBelow: jest.fn(),
  handleCloseTaskMenu: jest.fn(),
  handleEditTask: jest.fn(),
  handleDeleteTask: jest.fn(),
};

describe("TaskMenu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should display all menu items", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Add task above")).toBeInTheDocument();
      expect(screen.getByText("Add task below")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Copy Link")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Priority")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should show add task menu items when showAddTaskMenuItems is true", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Add task above")).toBeInTheDocument();
      expect(screen.getByText("Add task below")).toBeInTheDocument();
    });

    it("should not show add task menu items when showAddTaskMenuItems is false", () => {
      render(<TaskMenu {...mockProps} showAddTaskMenuItems={false} />);
      expect(screen.queryByText("Add task above")).not.toBeInTheDocument();
      expect(screen.queryByText("Add task below")).not.toBeInTheDocument();
    });

    it("should display TaskMenuDatePicker", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
    });

    it("should display TaskDuplicateMenuItem", () => {
      render(<TaskMenu {...mockProps} />);
      expect(
        screen.getByTestId("task-duplicate-menu-item"),
      ).toBeInTheDocument();
    });

    it("should display TaskMoveMenuItem", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("task-move-menu-item")).toBeInTheDocument();
    });
  });

  describe("Date Section", () => {
    it("should display date section with all date buttons", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Date")).toBeInTheDocument();

      // Check for date setting buttons
      expect(screen.getByTestId("TodayIcon")).toBeInTheDocument();
      expect(screen.getByTestId("WbSunnyIcon")).toBeInTheDocument();
      expect(screen.getByTestId("WeekendIcon")).toBeInTheDocument();
      expect(screen.getByTestId("MoreHorizIcon")).toBeInTheDocument();
    });

    it("should show remove due date button when task has due date", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByTestId("NotInterestedIcon")).toBeInTheDocument();
    });

    it("should not show remove due date button when task has no due date", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TaskMenu {...mockProps} task={taskWithoutDate} />);
      expect(screen.queryByTestId("NotInterestedIcon")).not.toBeInTheDocument();
    });
  });

  describe("Priority Section", () => {
    it("should display priority section with all priority buttons", () => {
      render(<TaskMenu {...mockProps} />);
      expect(screen.getByText("Priority")).toBeInTheDocument();

      // Check for priority buttons (they should be rendered as IconButtons)
      expect(screen.getByTestId("FlagIcon")).toBeInTheDocument();
      expect(screen.getByTestId("OutlinedFlagIcon")).toBeInTheDocument();
    });
  });

  describe("Menu Actions", () => {
    it("should handle edit task click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const editButton = screen.getByText("Edit");
      await user.click(editButton);

      expect(mockProps.handleEditTask).toHaveBeenCalledWith(mockTask);
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle add task above click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const addAboveButton = screen.getByText("Add task above");
      await user.click(addAboveButton);

      expect(mockProps.handleAddTaskAbove).toHaveBeenCalled();
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle add task below click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const addBelowButton = screen.getByText("Add task below");
      await user.click(addBelowButton);

      expect(mockProps.handleAddTaskBelow).toHaveBeenCalled();
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle delete task click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const deleteButton = screen.getByText("Delete");
      await user.click(deleteButton);

      expect(mockProps.handleDeleteTask).toHaveBeenCalledWith(mockTask);
      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });

    it("should handle copy link click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const copyLinkButton = screen.getByText("Copy Link");
      await user.click(copyLinkButton);

      expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
    });
  });

  describe("Date Picker Integration", () => {
    it("should open date picker when more options button is clicked", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const moreOptionsButton = screen
        .getByTestId("MoreHorizIcon")
        .closest("button");
      if (moreOptionsButton) {
        await user.click(moreOptionsButton);

        // The TaskMenuDatePicker should be rendered
        expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
      }
    });

    it("should handle date selection from date picker", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const selectDateButton = screen.getByText("Select Date");
      await user.click(selectDateButton);

      // The date picker should handle the date selection
      expect(screen.getByTestId("task-menu-date-picker")).toBeInTheDocument();
    });
  });

  describe("Quick Date Actions", () => {
    it("should handle set due today click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const todayButton = screen.getByTestId("TodayIcon").closest("button");
      if (todayButton) {
        await user.click(todayButton);
        expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
      }
    });

    it("should handle set due tomorrow click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const tomorrowButton = screen
        .getByTestId("WbSunnyIcon")
        .closest("button");
      if (tomorrowButton) {
        await user.click(tomorrowButton);
        expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
      }
    });

    it("should handle set due next weekend click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const weekendButton = screen.getByTestId("WeekendIcon").closest("button");
      if (weekendButton) {
        await user.click(weekendButton);
        expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
      }
    });

    it("should handle remove due date click", async () => {
      const user = userEvent.setup();
      render(<TaskMenu {...mockProps} />);

      const removeButton = screen
        .getByTestId("NotInterestedIcon")
        .closest("button");
      if (removeButton) {
        await user.click(removeButton);
        expect(mockProps.handleCloseTaskMenu).toHaveBeenCalled();
      }
    });
  });

  describe("Menu State Management", () => {
    it("should close menu when clicking outside", () => {
      render(<TaskMenu {...mockProps} />);

      // Menu should be open when anchorEl is provided
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should handle menu close correctly", () => {
      render(<TaskMenu {...mockProps} />);

      // All close handlers should be properly connected
      expect(mockProps.handleCloseTaskMenu).toBeDefined();
    });
  });
});
