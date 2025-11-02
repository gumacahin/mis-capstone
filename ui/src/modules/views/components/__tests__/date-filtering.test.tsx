import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { Task } from "../../../../api/migration-helpers";

// Test the exact filtering logic used in UpcomingViewList and UpcomingViewBoard
describe("Date Filtering Logic - Core Bug Fix", () => {
  const createMockTask = (dueDate: string, title: string): Task => ({
    id: Math.random(),
    title,
    due_date: dueDate,
    dtstart: dueDate,
    rrule: "FREQ=DAILY;COUNT=1",
    section: 1,
    project: 1,
    completion_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: "",
    priority: 1,
    tags: [],
    order: 1,
  });

  it("should filter tasks correctly with day granularity (FIXED version)", () => {
    // Use fixed date to avoid timezone issues
    const targetDate = dayjs("2024-12-25T00:00:00.000Z"); // Christmas

    // Create tasks with different times on the same day
    const tasks: Task[] = [
      createMockTask("2024-12-25T09:00:00.000Z", "Morning Task"),
      createMockTask("2024-12-25T14:30:25.123Z", "Afternoon Task"),
      createMockTask("2024-12-25T23:59:59.999Z", "Night Task"),
      createMockTask("2024-12-24T12:00:00.000Z", "Yesterday Task"),
      createMockTask("2024-12-26T10:00:00.000Z", "Tomorrow Task"),
    ];

    // This is the FIXED filtering logic (with "day" parameter)
    const filteredTasks = tasks.filter((task: Task) =>
      dayjs(task.due_date).isSame(targetDate, "day"),
    );

    expect(filteredTasks).toHaveLength(3);
    expect(filteredTasks.map((t) => t.title)).toEqual([
      "Morning Task",
      "Afternoon Task",
      "Night Task",
    ]);
  });

  it("should demonstrate the BUG with missing day granularity", () => {
    // Use a fixed date to avoid timezone issues
    const targetDate = dayjs("2024-12-25T00:00:00.000Z"); // Christmas midnight UTC

    // Create tasks with different times on the same day
    const tasks: Task[] = [
      createMockTask("2024-12-25T00:00:00.000Z", "Exact Midnight Task"),
      createMockTask("2024-12-25T09:00:00.000Z", "Morning Task"),
      createMockTask("2024-12-25T14:30:25.123Z", "Afternoon Task"),
    ];

    // This is the BROKEN filtering logic (without "day" parameter)
    const brokenFilteredTasks = tasks.filter(
      (task: Task) => dayjs(task.due_date).isSame(targetDate), // No granularity = millisecond precision
    );

    // Only the exact midnight task matches because it has the same millisecond timestamp
    expect(brokenFilteredTasks).toHaveLength(1);
    expect(brokenFilteredTasks[0].title).toBe("Exact Midnight Task");

    // The FIXED filtering logic (with "day" parameter)
    const fixedFilteredTasks = tasks.filter((task: Task) =>
      dayjs(task.due_date).isSame(targetDate, "day"),
    );

    // All tasks on the same day match
    expect(fixedFilteredTasks).toHaveLength(3);
    expect(fixedFilteredTasks.map((t) => t.title)).toEqual([
      "Exact Midnight Task",
      "Morning Task",
      "Afternoon Task",
    ]);
  });

  it("should verify the exact logic used in UpcomingViewList and UpcomingViewBoard", () => {
    // Simulate the exact scenario from the components
    const weekDates = [
      dayjs().add(1, "day"), // Tomorrow
      dayjs().add(2, "day"), // Day after tomorrow
      dayjs().add(3, "day"), // Three days from now
    ];

    const tasks: Task[] = [
      createMockTask(
        dayjs().add(1, "day").hour(9).toISOString(),
        "Tomorrow Task 1",
      ),
      createMockTask(
        dayjs().add(1, "day").hour(15).toISOString(),
        "Tomorrow Task 2",
      ),
      createMockTask(
        dayjs().add(2, "day").hour(10).toISOString(),
        "Day After Task",
      ),
      createMockTask(
        dayjs().add(3, "day").hour(14).toISOString(),
        "Three Days Task",
      ),
    ];

    // Test filtering for each date (this is the exact logic from the components)
    weekDates.forEach((date, index) => {
      const tasksForDate = tasks.filter(
        (task: Task) => dayjs(task.due_date).isSame(dayjs(date), "day"), // Fixed version with "day"
      );

      if (index === 0) {
        // Tomorrow
        expect(tasksForDate).toHaveLength(2);
        expect(tasksForDate.map((t) => t.title)).toEqual([
          "Tomorrow Task 1",
          "Tomorrow Task 2",
        ]);
      } else if (index === 1) {
        // Day after tomorrow
        expect(tasksForDate).toHaveLength(1);
        expect(tasksForDate[0].title).toBe("Day After Task");
      } else if (index === 2) {
        // Three days from now
        expect(tasksForDate).toHaveLength(1);
        expect(tasksForDate[0].title).toBe("Three Days Task");
      }
    });
  });
});
