import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { describe, expect, it } from "vitest";

dayjs.extend(utc);

import { Task } from "@shared";

// Mock task data similar to what the user is experiencing
const mockTasks: Task[] = [
  {
    id: 66,
    title: "<p>adsfsdfaf</p>",
    description: "",
    dtstart: "2025-11-02T16:00:00Z",
    rrule: "FREQ=DAILY;COUNT=1",
    anchor_mode: "SCHEDULED",
    due_date: "2025-11-02T16:00:00Z", // 4:00 PM UTC on Nov 2
    priority: "NONE",
    tags: [],
    completion_date: null,
    order: 79,
    section: 2,
    project: 2,
    section_title: null,
    project_title: "Inbox",
    comments_count: 0,
  },
  {
    id: 67,
    title: "<p>midnight task</p>",
    description: "",
    dtstart: "2025-11-02T00:00:00Z",
    rrule: "FREQ=DAILY;COUNT=1",
    anchor_mode: "SCHEDULED",
    due_date: "2025-11-02T00:00:00Z", // Midnight UTC on Nov 2
    priority: "NONE",
    tags: [],
    completion_date: null,
    order: 80,
    section: 2,
    project: 2,
    section_title: null,
    project_title: "Inbox",
    comments_count: 0,
  },
  {
    id: 68,
    title: "<p>different day task</p>",
    description: "",
    dtstart: "2025-11-03T16:00:00Z",
    rrule: "FREQ=DAILY;COUNT=1",
    anchor_mode: "SCHEDULED",
    due_date: "2025-11-03T16:00:00Z", // Nov 3
    priority: "NONE",
    tags: [],
    completion_date: null,
    order: 81,
    section: 2,
    project: 2,
    section_title: null,
    project_title: "Inbox",
    comments_count: 0,
  },
] as Task[];

describe("Frontend Date Filtering Logic", () => {
  it("should filter tasks correctly for November 2nd using FIXED date string comparison", () => {
    const targetDate = dayjs("2025-11-02");

    // This is the FIXED filtering logic from UpcomingViewBoard.tsx using UTC date string comparison
    const filteredTasks = mockTasks.filter(
      (task: Task) =>
        dayjs(task.due_date).utc().format("YYYY-MM-DD") ===
        dayjs(targetDate).format("YYYY-MM-DD"),
    );

    console.log("Target date:", targetDate.format("YYYY-MM-DD"));
    console.log(
      "All tasks:",
      mockTasks.map((t) => ({
        id: t.id,
        title: t.title,
        due_date: t.due_date,
      })),
    );
    console.log(
      "Filtered tasks:",
      filteredTasks.map((t) => ({
        id: t.id,
        title: t.title,
        due_date: t.due_date,
      })),
    );

    // Both Nov 2nd tasks should be included with the fix
    expect(filteredTasks).toHaveLength(2);
    expect(filteredTasks.find((t) => t.id === 66)).toBeDefined(); // 4:00 PM task
    expect(filteredTasks.find((t) => t.id === 67)).toBeDefined(); // Midnight task
    expect(filteredTasks.find((t) => t.id === 68)).toBeUndefined(); // Nov 3 task should not be included
  });

  it("should test dayjs.isSame behavior with different times on same date", () => {
    const nov2Midnight = dayjs("2025-11-02T00:00:00Z");
    const nov2Afternoon = dayjs("2025-11-02T16:00:00Z");
    const nov2EndOfDay = dayjs("2025-11-02T23:59:59Z");
    const nov3Midnight = dayjs("2025-11-03T00:00:00Z");

    const targetDate = dayjs("2025-11-02");

    console.log("Testing dayjs.isSame behavior:");
    console.log(
      'nov2Midnight.isSame(targetDate, "day"):',
      nov2Midnight.isSame(targetDate, "day"),
    );
    console.log(
      'nov2Afternoon.isSame(targetDate, "day"):',
      nov2Afternoon.isSame(targetDate, "day"),
    );
    console.log(
      'nov2EndOfDay.isSame(targetDate, "day"):',
      nov2EndOfDay.isSame(targetDate, "day"),
    );
    console.log(
      'nov3Midnight.isSame(targetDate, "day"):',
      nov3Midnight.isSame(targetDate, "day"),
    );

    // All Nov 2nd times should match
    expect(nov2Midnight.isSame(targetDate, "day")).toBe(true);
    expect(nov2Afternoon.isSame(targetDate, "day")).toBe(true);
    expect(nov2EndOfDay.isSame(targetDate, "day")).toBe(true);

    // Nov 3rd should not match
    expect(nov3Midnight.isSame(targetDate, "day")).toBe(false);
  });

  it("should test the exact filtering scenario from the user bug report", () => {
    // User's exact task data
    const userTask = {
      id: 66,
      due_date: "2025-11-02T16:00:00Z", // 4:00 PM UTC
    } as Task;

    const nov2Date = dayjs("2025-11-02");

    // Test the BROKEN filtering condition (original bug)
    const brokenFiltering = dayjs(userTask.due_date).isSame(nov2Date, "day");

    // Test the FIXED filtering condition (with UTC date string comparison)
    const fixedFiltering =
      dayjs(userTask.due_date).utc().format("YYYY-MM-DD") ===
      nov2Date.format("YYYY-MM-DD");

    console.log("User task due_date:", userTask.due_date);
    console.log("Target date:", nov2Date.format("YYYY-MM-DD"));
    console.log(
      'BROKEN: dayjs(due_date).isSame(targetDate, "day"):',
      brokenFiltering,
    );
    console.log(
      'FIXED: dayjs(due_date).utc().format("YYYY-MM-DD") === targetDate.format("YYYY-MM-DD"):',
      fixedFiltering,
    );

    // The broken version should be false (confirming the bug)
    expect(brokenFiltering).toBe(false);

    // The fixed version should be true
    expect(fixedFiltering).toBe(true);
  });

  it("should test timezone handling in dayjs.isSame", () => {
    // Test different timezone representations of the same date
    const utcTime = dayjs("2025-11-02T16:00:00Z");
    const localTime = dayjs("2025-11-02T16:00:00");
    const targetDate = dayjs("2025-11-02");

    console.log("UTC time:", utcTime.format());
    console.log("Local time:", localTime.format());
    console.log("Target date:", targetDate.format());

    console.log("UTC time isSame:", utcTime.isSame(targetDate, "day"));
    console.log("Local time isSame:", localTime.isSame(targetDate, "day"));

    // Both should match the target date
    expect(utcTime.isSame(targetDate, "day")).toBe(true);
    expect(localTime.isSame(targetDate, "day")).toBe(true);
  });

  it("should reproduce the BoardDateTasks filtering logic", () => {
    const nov2Date = dayjs("2025-11-02");

    // This simulates the props that BoardDateTasks receives
    const tasksPassedToComponent = mockTasks.filter((task: Task) =>
      dayjs(task.due_date).isSame(nov2Date, "day"),
    );

    console.log(
      "Tasks passed to BoardDateTasks for Nov 2:",
      tasksPassedToComponent.length,
    );
    console.log(
      "Task titles:",
      tasksPassedToComponent.map((t) => t.title),
    );

    // BoardDateTasks should receive both Nov 2nd tasks
    expect(tasksPassedToComponent).toHaveLength(2);

    // The component itself doesn't do additional filtering - it just renders what it receives
    // So if this test passes but the UI is empty, the issue is in the data flow
  });
});
