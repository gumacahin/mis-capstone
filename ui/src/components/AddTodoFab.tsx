import { Add as AddIcon } from "@mui/icons-material";
import Fab from "@mui/material/Fab";
import { useState } from "react";

import AddTodoDialog from "./AddTodoDialog";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export default function AddTodoFab() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Fab
        sx={fabStyle}
        onClick={() => setOpen(true)}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <AddTodoDialog open={open} setOpen={setOpen} />
    </>
  );
}
