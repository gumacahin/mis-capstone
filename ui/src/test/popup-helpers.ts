import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

/** Use this when components have hover delays / transitions */
export const userWithTimers = () =>
  userEvent.setup({ advanceTimers: vi.advanceTimersByTime, delay: null });

export async function openMenuByButtonName(name: RegExp | string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name }));
  return await screen.findByRole("menu");
}

export async function clickAway() {
  const user = userEvent.setup();
  await user.click(document.body);
}
