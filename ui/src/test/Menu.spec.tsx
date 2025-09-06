import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { render } from "./test-utils";

function DemoMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        aria-haspopup="menu"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        More
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>Delete</MenuItem>
      </Menu>
    </>
  );
}

describe("Menu", () => {
  it("opens and closes via item click", async () => {
    render(<DemoMenu />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /more/i }));
    expect(await screen.findByRole("menu")).toBeVisible();

    await user.click(screen.getByRole("menuitem", { name: /delete/i }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
