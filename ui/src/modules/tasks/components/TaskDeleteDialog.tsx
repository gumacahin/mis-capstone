import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDeleteTask } from "@shared/hooks/queries";
import type { Task } from "@shared/types/common";
import { toast } from "react-hot-toast";

export default function TaskDeleteDialog({
  handleClose,
  task,
}: {
  handleClose: () => void;
  task: Task;
}) {
  const deleteTask = useDeleteTask(task);
  const handleDelete = async () => {
    handleClose();
    await toast.promise(deleteTask.mutateAsync(), {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: "Error deleting task.",
    });
  };
  return (
    <>
      <Dialog
        open={Boolean(task)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Delete task "${task.title}?"`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack spacing={1}>
              <Alert severity="warning">
                <Typography>
                  Are you sure you want to delete this task?
                </Typography>
                <Typography>This cannot be undone.</Typography>
              </Alert>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
