import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDeleteProject } from "@shared/hooks/queries";
import { Project } from "@shared/types/common";
import { toast } from "react-hot-toast";

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
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
