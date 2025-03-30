import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext } from "react";
import { toast } from "react-hot-toast";

import ProjectContext from "../contexts/projectContext";
import { useDeleteSection } from "../hooks/queries";
import { Section } from "../types/common";

export default function ProjectSectionDeleteDialog({
  open,
  section,
  handleClose,
}: {
  open: boolean;
  section: Section;
  handleClose: () => void;
}) {
  const project = useContext(ProjectContext)!;
  const deleteSection = useDeleteSection(project.id, section.id);

  const handleDelete = async () => {
    await toast.promise(deleteSection.mutateAsync(), {
      loading: "Deleting section...",
      success: "Section deleted successfully!",
      error: "Failed deleting section.",
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Section</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the section &quot;{section.title}
          &quot;?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"outlined"} onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
