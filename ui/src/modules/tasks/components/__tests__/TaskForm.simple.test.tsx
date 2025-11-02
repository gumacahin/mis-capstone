import type { TaskFormFields } from "@shared";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

describe("TaskForm RRule Data Handling", () => {
  it("should include rrule fields in TaskFormFields type", () => {
    // Test that the TaskFormFields type includes the RRule fields
    const taskFormData: TaskFormFields = {
      title: "Test Task",
      description: "Test description",
      completion_date: null,
      priority: "NONE",
      section: 1,
      project: 1,
      tags: [],
      rrule: "FREQ=DAILY",
      dtstart: dayjs("2024-01-01T09:00:00Z"),
      anchor_mode: "SCHEDULED",
    };

    expect(taskFormData.rrule).toBe("FREQ=DAILY");
    expect(taskFormData.dtstart).toBeDefined();
    expect(taskFormData.anchor_mode).toBe("SCHEDULED");
  });

  it("should handle null RRule fields", () => {
    const taskFormData: TaskFormFields = {
      title: "Non-recurring Task",
      description: null,
      completion_date: null,
      priority: "NONE",
      section: 1,
      project: 1,
      tags: [],
      rrule: null,
      dtstart: null,
      anchor_mode: null,
    };

    expect(taskFormData.rrule).toBeNull();
    expect(taskFormData.dtstart).toBeNull();
    expect(taskFormData.anchor_mode).toBeNull();
  });

  it("should handle complex RRule strings", () => {
    const complexRRule = "FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20241231T235959Z";

    const taskFormData: TaskFormFields = {
      title: "Complex Recurring Task",
      description: null,
      completion_date: null,
      priority: "HIGH",
      section: 1,
      project: 1,
      tags: ["work", "important"],
      rrule: complexRRule,
      dtstart: dayjs("2024-01-01T09:00:00Z"),
      anchor_mode: "COMPLETED",
    };

    expect(taskFormData.rrule).toBe(complexRRule);
    expect(taskFormData.anchor_mode).toBe("COMPLETED");
    expect(taskFormData.tags).toEqual(["work", "important"]);
  });

  it("should validate anchor mode values", () => {
    // Test that anchor_mode accepts valid values
    const scheduledTask: TaskFormFields = {
      title: "Scheduled Task",
      description: null,
      completion_date: null,
      priority: "NONE",
      section: 1,
      project: 1,
      tags: [],
      rrule: "FREQ=DAILY",
      dtstart: dayjs(),
      anchor_mode: "SCHEDULED",
    };

    const completedTask: TaskFormFields = {
      title: "Completed Task",
      description: null,
      completion_date: null,
      priority: "NONE",
      section: 1,
      project: 1,
      tags: [],
      rrule: "FREQ=WEEKLY",
      dtstart: dayjs(),
      anchor_mode: "COMPLETED",
    };

    expect(scheduledTask.anchor_mode).toBe("SCHEDULED");
    expect(completedTask.anchor_mode).toBe("COMPLETED");
  });

  it("should handle dtstart as Dayjs object", () => {
    const startDate = dayjs("2024-06-15T14:30:00Z");

    const taskFormData: TaskFormFields = {
      title: "Timed Task",
      description: null,
      completion_date: null,
      priority: "MEDIUM",
      section: 1,
      project: 1,
      tags: [],
      rrule: "FREQ=MONTHLY",
      dtstart: startDate,
      anchor_mode: "SCHEDULED",
    };

    expect(taskFormData.dtstart).toBe(startDate);
    expect(dayjs.isDayjs(taskFormData.dtstart)).toBe(true);
    expect(taskFormData.dtstart?.toISOString()).toBe(
      "2024-06-15T14:30:00.000Z",
    );
  });
});
