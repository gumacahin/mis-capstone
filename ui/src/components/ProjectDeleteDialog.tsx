import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-hot-toast";

import { useDeleteProject } from "../api";
import { Project } from "../types/common";

export default function ProjectDeleteDialog({
  open,
  project,
  handleClose,
}: {
  open: boolean;
  project: Project;
  handleClose: () => void;
}) {
  const deleteProject = useDeleteProject(project);

  const handleDelete = async () => {
    await toast.promise(deleteProject.mutateAsync(), {
      loading: "Deleting project...",
      success: "Project deleted successfully!",
      error: "Failed deleting project.",
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the project &quot;{project.title}
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
