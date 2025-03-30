import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";

import { Section } from "../types/common";
import AddProjectSectionForm from "./AddProjectSectionForm";

export default function AddProjectSectionButton({
  precedingSection,
}: {
  precedingSection: Section;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box padding={2}>
      {open ? (
        <AddProjectSectionForm
          precedingSection={precedingSection}
          handleClose={handleClose}
        />
      ) : (
        <Button
          startIcon={<SplitscreenIcon />}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
          size="small"
          sx={{ textWrap: "nowrap" }}
        >
          Add Section
        </Button>
      )}
    </Box>
  );
}
