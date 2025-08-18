import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

import AddProjectDialog from "./AddProjectDialog";

function AddProjectButton() {
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const handleAddProjectClick = () => {
    setAddProjectDialogOpen(true);
  };

  return (
    <>
      <AddProjectDialog
        open={addProjectDialogOpen}
        handleClose={() => setAddProjectDialogOpen(false)}
      />
      <IconButton
        onClick={handleAddProjectClick}
        edge="end"
        aria-label="add project"
      >
        <AddIcon />
      </IconButton>
    </>
  );
}

export default AddProjectButton;
