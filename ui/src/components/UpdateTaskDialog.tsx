import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { type Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useUpdateTask } from "../api";
import type { ITaskFormFields, ProjectDetail, Task } from "../types/common";
import CommentList from "./CommentList";
import DatePicker from "./DatePicker";
import TaskCheckIcon from "./TaskCheckIcon";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectMenu from "./TaskProjectMenu";
import UpdateTaskLabels from "./UpdateTaskLabels";

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

export default function UpdateTaskDialog({
  open,
  handleClose,
  task,
  project,
}: {
  open: boolean;
  handleClose: () => void;
  task: Task;
  project: ProjectDetail;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [formActive, setFormActive] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(task.due_date != null);
  const updateTask = useUpdateTask(task, project);
  const defaultValues = {
    ...task,
    due_date: task.due_date ? dayjs(task.due_date) : null,
  };
  const { control, register, handleSubmit, watch } = useForm<ITaskFormFields>({
    defaultValues,
  });

  const sectionId = watch("section_id");
  const dueDate = watch("due_date");
  const priority = watch("priority");
  const labels = watch("labels");

  // FIXME: Too clunky. Revisit this when you get the chance.
  useEffect(() => {
    setShowDatePicker(dueDate != null);
  }, [dueDate]);
  const handleCloseDatePicker = () => {
    if (!dueDate) {
      setShowDatePicker(false);
    }
    setShowDatePicker(true);
  };

  const onSubmit: SubmitHandler<ITaskFormFields> = async (data) => {
    try {
      await toast.promise(updateTask.mutateAsync(data), {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Error updating task.",
      });
    } catch (error) {
      console.error("Error updating task", error);
    } finally {
      setFormActive(false);
    }
  };

  const taskIsCompleted = task.completion_date != null;

  return (
    <Dialog
      open={open}
      slotProps={{
        paper: {
          sx: {
            height: "80vh",
            minWidth: { xs: "100vw", sm: "600px", md: "800px" },
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography flexGrow={1}>Update Task</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: 0 }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid size={{ xs: 12, md: 8 }} padding={2}>
            <Box display="flex" flexDirection="row">
              <Box>
                <TaskCheckIcon disabled={formActive} task={task} />
              </Box>
              <Box flexGrow={1}>
                {!formActive && (
                  <Stack
                    sx={[taskIsCompleted && { cursor: "not-allowed" }]}
                    spacing={1}
                    onClick={() => {
                      if (!task.completion_date) {
                        setFormActive(true);
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        textDecoration: task.completion_date
                          ? "line-through"
                          : "default",
                        paddingTop: "8px",
                      }}
                    >
                      {task.title}
                    </Typography>
                    {!task.completion_date && task.description && (
                      <Typography>{task.description}</Typography>
                    )}
                    {!task.completion_date && !task.description && (
                      <Box display="flex" alignItems={"center"}>
                        <DescriptionIcon />
                        <Typography color="GrayText">Description</Typography>
                      </Box>
                    )}
                  </Stack>
                )}
                {formActive && (
                  <Stack
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={3}
                  >
                    <TextField
                      required
                      margin="dense"
                      id="title"
                      label="Task name"
                      type="text"
                      fullWidth
                      variant="standard"
                      {...register("title", { required: true })}
                    />
                    <TextField
                      multiline
                      margin="dense"
                      id="desciption"
                      label="Description"
                      type="text"
                      fullWidth
                      variant="standard"
                      {...register("description")}
                    />
                    <Stack
                      py={2}
                      direction="row"
                      spacing={1}
                      justifyContent={"flex-end"}
                    >
                      <Button
                        onClick={() => {
                          setFormActive(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Save Task
                      </Button>
                    </Stack>
                  </Stack>
                )}
                <CommentList task={task} />
                {/* <AddCommentForm task={data} userDisplayName={userDisplayName} /> */}
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={[
              {
                minHeight: "100%",
                backgroundColor: (theme: Theme) => theme.palette.grey[100],
                padding: 2,
              },
              taskIsCompleted && { cursor: "not-allowed" },
            ]}
          >
            <Typography
              variant="subtitle2"
              sx={[
                taskIsCompleted && {
                  color: (theme) => theme.palette.text.disabled,
                },
              ]}
            >
              Project
            </Typography>
            <TaskProjectMenu
              disabled={taskIsCompleted}
              fullWidth
              control={control}
              sectionId={sectionId}
              variant="text"
              sx={{
                ".MuiButton-endIcon": { flexGrow: 1, justifyContent: "end" },
              }}
            />
            <Divider sx={{ my: 1 }} />
            <Stack
              direction="row"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Tooltip title="Change due date">
                <Button
                  variant="text"
                  size="small"
                  fullWidth
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                  }}
                  color="inherit"
                  disabled={taskIsCompleted}
                  onClick={() => {
                    setShowDatePicker(true);
                    setTimeout(() => ref.current?.click(), 0);
                  }}
                  endIcon={!dueDate && <AddIcon fontSize="small" />}
                >
                  <Typography variant="subtitle2">Due Date</Typography>
                </Button>
              </Tooltip>
            </Stack>
            {showDatePicker && (
              <DatePicker
                onClose={handleCloseDatePicker}
                disabled={taskIsCompleted}
                control={control}
                ref={ref}
                variant="text"
                fullWidth
              />
            )}
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="subtitle2"
              sx={[
                taskIsCompleted && {
                  color: (theme) => theme.palette.grey[500],
                },
              ]}
            >
              Priority
            </Typography>
            <TaskPriorityMenu
              disabled={taskIsCompleted}
              priority={priority}
              fullWidth
              variant="text"
              control={control}
              sx={{
                ".MuiButton-endIcon": { flexGrow: 1, justifyContent: "end" },
              }}
            />
            <Divider sx={{ my: 1 }} />
            <UpdateTaskLabels
              labels={labels}
              control={control}
              disabled={taskIsCompleted}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
