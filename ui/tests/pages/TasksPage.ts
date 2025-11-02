import { expect, Locator, Page } from "@playwright/test";

import { TestTask } from "../fixtures/testData";
import { TaskTagsMenuPage } from "./TaskTagsMenuPage";

/**
 * Page Object Model for task-related operations
 * Handles task creation, editing, and management
 */
export class TasksPage {
  readonly page: Page;
  readonly addTaskButton: Locator;
  readonly taskForm: Locator;
  readonly taskTitleInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly tagsButton: Locator;
  readonly saveTaskButton: Locator;
  readonly cancelButton: Locator;
  readonly tasksList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addTaskButton = page.locator('[data-testid="add-task-button"]');
    this.taskForm = page.locator('[data-testid="task-form"]');
    this.taskTitleInput = page.locator('[data-testid="task-title"]');
    this.taskDescriptionInput = page.locator(
      '[data-testid="task-description"]',
    );
    this.tagsButton = page.locator('[data-testid="task-tags-button"]');
    this.saveTaskButton = page.locator('[data-testid="save-task"]');
    this.cancelButton = page.locator('[data-testid="cancel-task"]');
    this.tasksList = page.locator('[data-testid="tasks-list"]');
  }

  /**
   * Navigate to the Today page where tasks are managed
   */
  async navigateToToday() {
    await this.page.goto("/today");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Click the add task button to open the task creation form
   */
  async clickAddTask() {
    await expect(this.addTaskButton).toBeVisible();
    await this.addTaskButton.click();
    await expect(this.taskForm).toBeVisible();
  }

  /**
   * Fill in the basic task information
   */
  async fillTaskBasics(task: Partial<TestTask>) {
    if (task.title) {
      await this.taskTitleInput.fill(task.title);
    }

    if (task.description) {
      await this.taskDescriptionInput.fill(task.description);
    }
  }

  /**
   * Open the tags menu for tag selection
   */
  async openTagsMenu(): Promise<TaskTagsMenuPage> {
    await this.tagsButton.click();
    const tagsMenu = new TaskTagsMenuPage(this.page);
    await tagsMenu.waitForMenu();
    return tagsMenu;
  }

  /**
   * Save the current task
   */
  async saveTask() {
    await this.saveTaskButton.click();
    // Wait for form to close and task to be saved
    await expect(this.taskForm).not.toBeVisible();
  }

  /**
   * Cancel task creation/editing
   */
  async cancelTask() {
    await this.cancelButton.click();
    await expect(this.taskForm).not.toBeVisible();
  }

  /**
   * Create a complete task with tags
   */
  async createTaskWithTags(task: TestTask) {
    await this.clickAddTask();
    await this.fillTaskBasics(task);

    if (task.tags && task.tags.length > 0) {
      const tagsMenu = await this.openTagsMenu();

      for (const tag of task.tags) {
        // Try to select existing tag, create if doesn't exist
        try {
          await tagsMenu.selectExistingTag(tag);
        } catch {
          await tagsMenu.createNewTag(tag);
        }
      }

      await tagsMenu.closeMenu();
    }

    await this.saveTask();
  }

  /**
   * Find a task in the list by title
   */
  getTaskByTitle(title: string): Locator {
    return this.page.locator(`[data-testid="task-item"]:has-text("${title}")`);
  }

  /**
   * Verify that a task exists in the list
   */
  async verifyTaskExists(title: string) {
    const task = this.getTaskByTitle(title);
    await expect(task).toBeVisible();
  }

  /**
   * Verify that a task has specific tags
   */
  async verifyTaskHasTags(taskTitle: string, expectedTags: string[]) {
    const task = this.getTaskByTitle(taskTitle);

    for (const tag of expectedTags) {
      const tagElement = task.locator(
        `[data-testid="task-tag"]:has-text("${tag}")`,
      );
      await expect(tagElement).toBeVisible();
    }
  }

  /**
   * Get all visible tasks
   */
  async getVisibleTasks(): Promise<string[]> {
    const taskElements = this.page.locator(
      '[data-testid="task-item"] [data-testid="task-title"]',
    );
    const taskTitles: string[] = [];

    const count = await taskElements.count();
    for (let i = 0; i < count; i++) {
      const title = await taskElements.nth(i).textContent();
      if (title) {
        taskTitles.push(title.trim());
      }
    }

    return taskTitles;
  }

  /**
   * Complete a task by clicking its checkbox
   */
  async completeTask(taskTitle: string) {
    const task = this.getTaskByTitle(taskTitle);
    const checkbox = task.locator('[data-testid="task-checkbox"]');
    await checkbox.click();
  }

  /**
   * Open task menu for a specific task
   */
  async openTaskMenu(taskTitle: string) {
    const task = this.getTaskByTitle(taskTitle);
    const menuButton = task.locator('[data-testid="task-menu-button"]');
    await menuButton.click();
  }

  /**
   * Edit a task
   */
  async editTask(taskTitle: string) {
    await this.openTaskMenu(taskTitle);
    await this.page.click('[data-testid="edit-task"]');
    await expect(this.taskForm).toBeVisible();
  }

  /**
   * Delete a task
   */
  async deleteTask(taskTitle: string) {
    await this.openTaskMenu(taskTitle);
    await this.page.click('[data-testid="delete-task"]');
    // Handle confirmation if needed
    const confirmButton = this.page.locator('[data-testid="confirm-delete"]');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
  }
}
