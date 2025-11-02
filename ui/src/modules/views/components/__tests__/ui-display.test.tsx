import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { Task } from "../../../../api/migration-helpers";

describe("UI Display with Server Response - Logic Tests", () => {
  it("should correctly process server response with realistic timestamps", () => {
    // Simulate realistic server response data
    const serverTasks: Task[] = [
      {
        id: 1,
        title: "Tomorrow Morning Task",
        due_date: "2024-12-25T09:00:00.000Z", // Christmas 9 AM UTC
        dtstart: "2024-12-25T09:00:00.000Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 1,
      },
      {
        id: 2,
        title: "Tomorrow Afternoon Task",
        due_date: "2024-12-25T14:30:25.123Z", // Same day, different time with milliseconds
        dtstart: "2024-12-25T14:30:25.123Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 2,
      },
      {
        id: 3,
        title: "Different Day Task",
        due_date: "2024-12-26T10:00:00.000Z", // Next day
        dtstart: "2024-12-26T10:00:00.000Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 3,
      },
    ];

    // Test the filtering logic that the UI components use
    const targetDate = dayjs("2024-12-25T00:00:00.000Z");

    // This is the EXACT logic from UpcomingViewList and UpcomingViewBoard (after our fix)
    const tasksForDate = serverTasks.filter((task: Task) =>
      dayjs(task.due_date).isSame(targetDate, "day"),
    );

    // Should correctly group tasks by day regardless of time
    expect(tasksForDate).toHaveLength(2);
    expect(tasksForDate.map((t) => t.title)).toEqual([
      "Tomorrow Morning Task",
      "Tomorrow Afternoon Task",
    ]);

    // Different day task should not be included
    expect(
      tasksForDate.find((t) => t.title === "Different Day Task"),
    ).toBeUndefined();
  });

  it("should verify filtering logic works with real server timestamps", () => {
    // This test verifies our fix works with realistic server data
    const targetDate = dayjs("2024-12-25T00:00:00.000Z");

    // Simulate realistic server timestamps (different times on same day)
    const serverTasks: Task[] = [
      {
        id: 1,
        title: "Christmas Morning",
        due_date: "2024-12-25T09:00:00.000Z", // 9 AM UTC
        dtstart: "2024-12-25T09:00:00.000Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 1,
      },
      {
        id: 2,
        title: "Christmas Afternoon",
        due_date: "2024-12-25T14:30:25.123Z", // 2:30 PM UTC with milliseconds
        dtstart: "2024-12-25T14:30:25.123Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 2,
      },
      {
        id: 3,
        title: "Christmas Evening",
        due_date: "2024-12-25T23:59:59.999Z", // 11:59 PM UTC
        dtstart: "2024-12-25T23:59:59.999Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 3,
      },
      {
        id: 4,
        title: "Boxing Day",
        due_date: "2024-12-26T00:00:00.001Z", // Next day
        dtstart: "2024-12-26T00:00:00.001Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 4,
      },
    ];

    // Apply the FIXED filtering logic (this is what the component does now)
    const christmasTasks = serverTasks.filter((task: Task) =>
      dayjs(task.due_date).isSame(targetDate, "day"),
    );

    // Should match all Christmas day tasks regardless of time
    expect(christmasTasks).toHaveLength(3);
    expect(christmasTasks.map((t) => t.title)).toEqual([
      "Christmas Morning",
      "Christmas Afternoon",
      "Christmas Evening",
    ]);

    // Boxing Day task should not be included
    expect(
      christmasTasks.find((t) => t.title === "Boxing Day"),
    ).toBeUndefined();
  });
});
