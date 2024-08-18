import IconButton from "@mui/material/IconButton";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Task } from "../types/common";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Alert, Stack } from "@mui/material";
import { useDeleteTask } from "../api";
import toast from "react-hot-toast";

function DeleteTaskDialog({
  showDialog,
  setShowDialog,
  task,
}: {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  task: Task;
}) {
  const deleteTask = useDeleteTask(task);
  const handleDelete = () => {
    toast.promise(deleteTask.mutateAsync(), {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: "Error deleting task.",
    });
    setShowDialog(false);
  };
  return (
    <>
      <Dialog
        open={showDialog}
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
          <Button onClick={() => setShowDialog(false)} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function TaskActionsMenuIcon({ task }: { task: Task }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setShowDialog(true);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="task actions menu"
        id={`task-action-menu-icon-for-task-${task.id}`}
        aria-controls={open ? `` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreHorizOutlinedIcon />
      </IconButton>
      <Menu
        id={`task-action-menu-for-task-${task.id}`}
        aria-labelledby={`task-action-menu-icon-for-task-${task.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <DeleteTaskDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        task={task}
      />
    </>
  );
}
