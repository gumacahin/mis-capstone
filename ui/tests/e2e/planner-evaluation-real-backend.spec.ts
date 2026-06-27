import { expect, test } from "@playwright/test";

test.describe("Planner evaluation real backend demo", () => {
  test("runs the capstone walkthrough flow against Django", async ({
    page,
  }, testInfo) => {
    const suggestionHeading = (name: string) =>
      page.getByRole("heading", { name }).first();

    await page.goto("/today");

    await expect(
      page.getByRole("heading", { name: "Low-energy plan" }),
    ).toBeVisible();
    await expect(page.getByLabel("Minutes")).toHaveValue("90");
    await expect(page.getByLabel("Context")).toHaveValue(
      "Evaluation walkthrough: limited energy between meetings.",
    );

    await expect(
      suggestionHeading("Grade overdue reflection submissions"),
    ).toBeVisible();
    await expect(
      suggestionHeading("Finalize today's class announcement"),
    ).toBeVisible();
    await expect(
      suggestionHeading("Review thesis proposal comments"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Why this?" }).first().click();
    const reasonRegion = page.getByRole("region", {
      name: "Reason for Grade overdue reflection submissions",
    });
    await expect(reasonRegion).toBeVisible();
    await expect(
      reasonRegion.getByText("Why this matters today"),
    ).toBeVisible();
    await expect(reasonRegion.getByText("Task signals")).toBeVisible();
    await expect(
      reasonRegion.getByText("Capstone Evaluation Demo / Teaching"),
    ).toBeVisible();

    await page.getByLabel("Minutes").fill("75");
    await page
      .getByLabel("Context")
      .fill("Real backend walkthrough: choose a realistic next task.");
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByLabel("Minutes")).toHaveValue("75");
    await expect(page.getByLabel("Context")).toHaveValue(
      "Real backend walkthrough: choose a realistic next task.",
    );

    await page.getByRole("button", { name: "Accept" }).first().click();
    await expect(page.getByText("accepted", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Snooze" }).nth(1).click();
    await expect(page.getByText("snoozed", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Dismiss" }).nth(2).click();
    await expect(
      suggestionHeading("Review thesis proposal comments"),
    ).toBeHidden();

    await page.getByLabel("Helpful rating").fill("4");
    await page.getByLabel("Confidence rating").fill("4");
    await page
      .getByLabel("Feedback note")
      .fill("Real backend demo run: recommendation was understandable.");
    await page.getByRole("button", { name: "Save feedback" }).click();
    await expect(page.getByText("Feedback saved")).toBeVisible();

    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath("planner-evaluation-real-backend.png"),
    });
  });
});
