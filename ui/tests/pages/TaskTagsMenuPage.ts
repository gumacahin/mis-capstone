import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object Model for TaskTagsMenu component
 * Handles interactions with the tag selection menu
 */
export class TaskTagsMenuPage {
  readonly page: Page;
  readonly menu: Locator;
  readonly searchInput: Locator;
  readonly tagOptions: Locator;
  readonly createTagButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menu = page.locator("#task-labels-menu");
    this.searchInput = page.locator("#task-labels-search");
    this.tagOptions = page.locator('[data-testid="tag-option"]');
    this.createTagButton = page.locator('[data-testid="create-tag"]');
    this.noResultsMessage = page.locator("text=Label not found");
  }

  /**
   * Wait for the tags menu to be visible
   */
  async waitForMenu() {
    await expect(this.menu).toBeVisible();
  }

  /**
   * Search for a tag by typing in the search input
   */
  async searchTag(tagName: string) {
    await this.searchInput.fill(tagName);
    // Wait for search filtering to complete
    await this.page.waitForTimeout(100);
  }

  /**
   * Select an existing tag from the dropdown
   */
  async selectExistingTag(tagName: string) {
    const tagOption = this.page.locator(
      `[role="menuitem"]:has-text("${tagName}")`,
    );
    await expect(tagOption).toBeVisible();
    await tagOption.click();
  }

  /**
   * Create a new tag by clicking the create button
   */
  async createNewTag(tagName: string) {
    await this.searchTag(tagName);

    // Wait for create button to appear
    const createButton = this.page.locator(
      `text=Create new label "${tagName}"`,
    );
    await expect(createButton).toBeVisible();
    await createButton.click();
  }

  /**
   * Check if a tag is currently selected (checkbox checked)
   */
  async isTagSelected(tagName: string): Promise<boolean> {
    const tagRow = this.page.locator(
      `[role="menuitem"]:has-text("${tagName}")`,
    );
    const checkbox = tagRow.locator('input[type="checkbox"]');
    return await checkbox.isChecked();
  }

  /**
   * Toggle a tag selection (select if unselected, unselect if selected)
   */
  async toggleTag(tagName: string) {
    const tagRow = this.page.locator(
      `[role="menuitem"]:has-text("${tagName}")`,
    );
    const checkbox = tagRow.locator('input[type="checkbox"]');
    await checkbox.click();
  }

  /**
   * Get all visible tag options
   */
  async getVisibleTags(): Promise<string[]> {
    const tagElements = this.page.locator(
      '[role="menuitem"] .MuiListItemText-root',
    );
    const tagTexts: string[] = [];

    const count = await tagElements.count();
    for (let i = 0; i < count; i++) {
      const text = await tagElements.nth(i).textContent();
      if (text && !text.includes("Create new label")) {
        tagTexts.push(text.trim());
      }
    }

    return tagTexts;
  }

  /**
   * Check if the "no results" message is visible
   */
  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  /**
   * Check if create new tag option is available
   */
  async canCreateTag(tagName: string): Promise<boolean> {
    const createOption = this.page.locator(
      `text=Create new label "${tagName}"`,
    );
    return await createOption.isVisible();
  }

  /**
   * Close the tags menu
   */
  async closeMenu() {
    // Click outside the menu to close it
    await this.page.click("body", { position: { x: 0, y: 0 } });
    await expect(this.menu).not.toBeVisible();
  }

  /**
   * Clear the search input
   */
  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(100);
  }

  /**
   * Get the current search value
   */
  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * Verify that specific tags are selected
   */
  async verifySelectedTags(expectedTags: string[]) {
    for (const tag of expectedTags) {
      const isSelected = await this.isTagSelected(tag);
      expect(isSelected).toBe(true);
    }
  }

  /**
   * Verify that specific tags are not selected
   */
  async verifyUnselectedTags(expectedTags: string[]) {
    for (const tag of expectedTags) {
      const isSelected = await this.isTagSelected(tag);
      expect(isSelected).toBe(false);
    }
  }
}
