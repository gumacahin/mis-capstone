import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

import AddLabelDialog from "./AddLabelDialog";

function AddLabelButton() {
  const [addLabelDialogOpen, setAddLabelDialogOpen] = useState(false);
  const handleAddLabelClick = () => {
    setAddLabelDialogOpen(true);
  };

  return (
    <>
      <AddLabelDialog
        open={addLabelDialogOpen}
        handleClose={() => setAddLabelDialogOpen(false)}
      />
      <IconButton
        onClick={handleAddLabelClick}
        edge="end"
        aria-label="add label"
      >
        <AddIcon />
      </IconButton>
    </>
  );
}

export default AddLabelButton;
