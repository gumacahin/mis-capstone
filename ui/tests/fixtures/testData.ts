// Test data fixtures for E2E tests

export interface TestTask {
  title: string;
  description?: string;
  tags?: string[];
  priority?: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  project?: string;
}

export interface TestTag {
  name: string;
  color?: string;
}

export interface TestProject {
  title: string;
  description?: string;
  color?: string;
}

// Task test data
export const testTasks: Record<string, TestTask> = {
  simple: {
    title: "Simple Test Task",
    description: "A basic task for testing",
  },

  withTags: {
    title: "Task with Tags",
    description: "Task for testing tag functionality",
    tags: ["urgent", "work", "testing"],
  },

  highPriority: {
    title: "High Priority Task",
    description: "Important task with high priority",
    priority: "HIGH",
    tags: ["urgent", "important"],
  },

  withDueDate: {
    title: "Task with Due Date",
    description: "Task that has a due date",
    dueDate: "2024-12-31",
    tags: ["deadline"],
  },

  projectTask: {
    title: "Project Task",
    description: "Task assigned to a specific project",
    project: "Test Project",
    tags: ["project", "milestone"],
  },
};

// Tag test data
export const testTags: Record<string, TestTag> = {
  urgent: { name: "urgent" },
  work: { name: "work" },
  personal: { name: "personal" },
  meeting: { name: "meeting" },
  research: { name: "research" },
  coding: { name: "coding" },
  testing: { name: "testing" },
  important: { name: "important" },
  lowPriority: { name: "low-priority" },
  deadline: { name: "deadline" },
  project: { name: "project" },
  milestone: { name: "milestone" },
};

// Project test data
export const testProjects: Record<string, TestProject> = {
  personal: {
    title: "Personal Tasks",
    description: "Personal goals and tasks",
  },

  work: {
    title: "Work Project",
    description: "Work-related tasks and projects",
  },

  testing: {
    title: "Test Project",
    description: "Project for testing purposes",
  },
};

// Utility functions for test data
export class TestDataHelper {
  /**
   * Generate a unique task title for testing
   */
  static generateUniqueTaskTitle(prefix: string = "Test Task"): string {
    const timestamp = Date.now();
    return `${prefix} ${timestamp}`;
  }

  /**
   * Generate a unique tag name for testing
   */
  static generateUniqueTagName(prefix: string = "test-tag"): string {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  }

  /**
   * Create a task with random data for testing
   */
  static createRandomTask(): TestTask {
    return {
      title: this.generateUniqueTaskTitle(),
      description: "Auto-generated task for testing",
      tags: ["auto-generated", "test"],
      priority: "MEDIUM",
    };
  }
}
