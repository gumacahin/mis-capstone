import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { render } from "./test-utils";

function DemoDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open form</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("opens and closes", async () => {
    render(<DemoDialog />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /open form/i }));
    expect(
      await screen.findByRole("dialog", { name: /settings/i }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(
      screen.queryByRole("dialog", { name: /settings/i }),
    ).not.toBeInTheDocument();
  });
});
