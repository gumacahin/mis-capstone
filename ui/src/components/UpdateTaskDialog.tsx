import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useAddComment, useAuth, useTask, useUpdateTask } from "../api";
import { ITask } from "../types/common";
import CommentList from "./CommentList";
import DueDatePicker from "./DueDatePicker";
import TaskCheckIcon from "./TaskCheckIcon";

function DescriptionIcon() {
  return (
    <Box
      color="GrayText"
      mr={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M8.5 12a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1h5Zm3.864-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 9H3.636C3.285 9 3 8.777 3 8.5c0-.245.225-.45.522-.491L3.636 8h8.728Zm0-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 5H3.636C3.285 5 3 4.777 3 4.5c0-.245.225-.45.522-.491L3.636 4h8.728Z"
        ></path>
      </svg>
    </Box>
  );
}

function AddCommentForm({
  task,
  userDisplayName,
}: {
  task: ITask;
  userDisplayName: string;
}) {
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const addComment = useAddComment(task);
  const handleSubmit = async () => {
    setIsLoading(true);
    toast.promise(
      addComment.mutateAsync(
        {
          body: comment,
          task_id: task.id,
          date: dayjs().format("YYYY-MM-DD"),
        },
        {
          onSuccess: () => {
            setComment("");
            setAddCommentOpen(false);
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      ),
      {
        loading: "Adding  comment...",
        success: "Comment added successfully!",
        error: "Error: Failed adding comment.",
      },
    );
  };

  return (
    <>
      {!addCommentOpen && (
        <List>
          <ListItem>
            <ListItemIcon>
              <Avatar {...stringAvatar(userDisplayName)} />
            </ListItemIcon>
            <ListItemText
              primary={
                <TextField
                  fullWidth
                  placeholder="Comment"
                  onClick={() => setAddCommentOpen(true)}
                />
              }
            />
          </ListItem>
        </List>
      )}
      {addCommentOpen && (
        <Stack my={3} spacing={1}>
          <TextField
            id="comment"
            label="Comment"
            multiline
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
            <Button onClick={() => setAddCommentOpen(false)} variant="text">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleSubmit}
              variant="contained"
            >
              Add Comment
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default function UpdateTaskDialog({
  open,
  handleClose,
  task,
}: {
  open: boolean;
  handleClose: () => void;
  task: ITask;
}) {
  const { data: user } = useAuth();
  const userId = user?.id;
  const [formActive, setFormActive] = useState(false);
  const updateTask = useUpdateTask(task);
  const { isError, data } = useTask(task);

  const userDisplayName = user
    ? user?.first_name + " " + (user?.last_name && user.last_name[0])
    : "Todo User";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries()) as unknown as ITask;
    toast.promise(updateTask.mutateAsync(newTask), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
    setFormActive(false);
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: { minWidth: { xs: "100vw", sm: 600 } },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Update Task</Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isError && <Alert severity="error">Failed to load task</Alert>}
        {data && (
          <Box display="flex" flexDirection="row">
            <Box>
              <TaskCheckIcon disabled={formActive} task={data} />
            </Box>
            <Box flexGrow={1}>
              {!formActive && (
                <Stack
                  sx={{ cursor: data.completed ? "not-allowed" : "pointer" }}
                  spacing={1}
                  onClick={() => {
                    if (!data.completed) {
                      setFormActive(true);
                    }
                  }}
                >
                  <Typography
                    sx={{
                      textDecoration: data.completed
                        ? "line-through"
                        : "default",
                      paddingTop: "8px",
                    }}
                  >
                    {data.title}
                  </Typography>
                  {!data.completed && data.note && (
                    <Typography>{data.note}</Typography>
                  )}
                  {!data.completed && !data.note && (
                    <Box display="flex" alignItems={"center"}>
                      <DescriptionIcon />
                      <Typography color="GrayText"> Description</Typography>
                    </Box>
                  )}
                </Stack>
              )}
              {formActive && (
                <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                  <TextField
                    defaultValue={data.title}
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Task name"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    defaultValue={data.note}
                    multiline
                    margin="dense"
                    id="desciption"
                    name="note"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <DueDatePicker
                    defaultValue={
                      data.due_date ? dayjs(data.due_date).toDate() : undefined
                    }
                  />
                  <Stack
                    py={2}
                    direction="row"
                    spacing={1}
                    justifyContent={"flex-end"}
                  >
                    <Button onClick={() => setFormActive(false)}>Cancel</Button>
                    <Button type="submit" variant="contained">
                      Save Task
                    </Button>
                  </Stack>
                </Stack>
              )}
              <CommentList task={data} userId={userId} />
              <AddCommentForm task={data} userDisplayName={userDisplayName} />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}
