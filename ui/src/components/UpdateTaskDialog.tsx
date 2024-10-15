import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import DueDatePicker from "./DueDatePicker";
import { toast } from "react-hot-toast";
import { Task } from "../types/common";
import { useUpdateTask, useTask, useAddComment, useAuth } from "../api";
import TaskCheckIcon from "./TaskCheckIcon";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CommentList from "./CommentList";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

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

function AddCommentForm({ task }: { task: Task }) {
  const { data: user } = useAuth();
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

  const userDisplayName = user
    ? user?.first_name + " " + (user?.last_name && user.last_name[0])
    : "Todo User";
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
                  placeholder="Comment"
                  onClick={() => setAddCommentOpen(true)}
                />
              }
            />
          </ListItem>
        </List>
      )}
      {addCommentOpen && (
        <Stack my={3} spacing={2}>
          <TextField
            autoFocus
            id="comment"
            label="Comment"
            multiline
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
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
  defaultDueDate,
}: {
  open: boolean;
  handleClose: () => void;
  task: Task;
  defaultDueDate?: Date;
}) {
  const [formActive, setFormActive] = useState(false);
  const updateTask = useUpdateTask(task);
  const { isError, data } = useTask(task);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries()) as unknown as Task;
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
        component: "form",
        onSubmit: handleSubmit,
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
                <>
                  <Stack spacing={3}>
                    <TextField
                      defaultValue={data.title}
                      autoFocus
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
                        data.due_date
                          ? dayjs(data.due_date).toDate()
                          : defaultDueDate
                      }
                    />
                  </Stack>
                  <Box
                    width="100%"
                    display="flex"
                    justifyContent={"end"}
                    py={2}
                  >
                    <Button onClick={() => setFormActive(false)}>Cancel</Button>
                    <Button type="submit">Save Task</Button>
                  </Box>
                </>
              )}
              <CommentList task={data} />
              <AddCommentForm task={data} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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
