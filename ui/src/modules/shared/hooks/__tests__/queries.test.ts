import { describe, expect, it } from "vitest";

import { type AppNotification, normalizeNotifications } from "../queries";

const notification: AppNotification = {
  id: 1,
  type: "task_due",
  title: "Task due",
  message: "A task is due today.",
  is_read: false,
  task: 10,
  created_at: "2026-06-28T00:00:00Z",
};

describe("normalizeNotifications", () => {
  it("returns array responses unchanged", () => {
    expect(normalizeNotifications([notification])).toEqual([notification]);
  });

  it("returns paginated DRF results", () => {
    expect(
      normalizeNotifications({
        results: [notification],
      }),
    ).toEqual([notification]);
  });

  it("returns an empty list for malformed paginated responses", () => {
    expect(normalizeNotifications({})).toEqual([]);
  });
});
