import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { type Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useUpdateTask } from "../api";
import type { Task, TaskFormFields } from "../types/common";
import DescriptionField from "./DescriptionField";
import DescriptionIcon from "./DescriptionIcon";
import TaskCheckIcon from "./TaskCheckIcon";
import TitleField from "./TitleField";
import UpdateTaskDialogDudeDate from "./UpdateTaskDialogDueDate";
import UpdateTaskDialogTags from "./UpdateTaskDialogTags";
import UpdateTaskPriorityMenu from "./UpdateTaskPriorityMenu";
import UpdateTaskProjectButton from "./UpdateTaskProjectButton";

interface UpdateTaskDialogProps {
  onClose: () => void;
  task: Task;
}

export default function UpdateTaskDialog({
  onClose,
  task,
}: UpdateTaskDialogProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formActive, setFormActive] = useState(false);
  const updateTask = useUpdateTask(task);
  const [showDatePicker, setShowDatePicker] = useState(task.due_date != null);
  const defaultValues = {
    title: task.title,
    description: task.description,
  };
  const { control, handleSubmit, formState } = useForm<TaskFormFields>({
    defaultValues,
  });

  const taskMenuOpen = Boolean(anchorEl);

  const onSubmit: SubmitHandler<TaskFormFields> = async (data) => {
    try {
      if (data.description === "<p></p>") {
        data.description = "";
      }
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

  useEffect(() => {
    setShowDatePicker(!!task.due_date);
  }, [task.due_date]);

  const handleOpenTaskMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseTaskMenu = () => {
    setAnchorEl(null);
  };

  const handleNextTask = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };
  const handlePreviousTask = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleDuplicateMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };
  const handleCopyMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };
  const handleDeleteMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };

  const taskIsCompleted = task.completion_date != null;

  return (
    <>
      <Dialog
        open
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row">
              <Button size="small" startIcon={<TagIcon fontSize="small" />}>
                {task.project_title}
              </Button>
              {task.section_title && (
                <>
                  {" "}
                  /{" "}
                  <Button
                    size="small"
                    startIcon={<SplitscreenIcon fontSize="small" />}
                  >
                    {task.section_title}
                  </Button>
                </>
              )}
            </Stack>
            <Stack direction="row">
              <IconButton size="small" onClick={handlePreviousTask}>
                <ExpandLessIcon />
              </IconButton>
              <IconButton size="small" onClick={handleNextTask}>
                <ExpandMoreIcon />
              </IconButton>
              <IconButton size="small" onClick={handleOpenTaskMenu}>
                <MoreHorizIcon />
              </IconButton>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
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
                          "& p": {
                            margin: 0,
                          },
                          fontSize: (theme: Theme) => {
                            return theme.typography.h6.fontSize;
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: task.title,
                        }}
                      />
                      {!task.completion_date && task.description && (
                        <Typography
                          dangerouslySetInnerHTML={{ __html: task.description }}
                          sx={{
                            "& p": {
                              margin: 0,
                            },
                          }}
                        />
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
                    <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
                      <Stack
                        spacing={0}
                        sx={{
                          border: "2px solid",
                          borderColor: "primary.main",
                          borderRadius: (theme) => theme.spacing(0.5),
                        }}
                      >
                        <TitleField
                          onEnter={handleSubmit(onSubmit)}
                          control={control}
                          p={1}
                        />
                        <DescriptionField p={1} control={control} />
                      </Stack>
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
                        <Button disabled={!formState.isValid} type="submit">
                          Save Task
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                  {/* <CommentList task={task} /> */}
                  {/* <AddCommentForm task={data} userDisplayName={userDisplayName} /> */}
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={[
                {
                  minHeight: "100%",
                  backgroundColor: (theme: Theme) =>
                    theme.palette.background.paper,
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
              <UpdateTaskProjectButton task={task} />
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
                    endIcon={!task.due_date && <AddIcon fontSize="small" />}
                  >
                    <Typography variant="subtitle2">Due Date</Typography>
                  </Button>
                </Tooltip>
              </Stack>
              {showDatePicker && (
                <UpdateTaskDialogDudeDate
                  task={task}
                  setShowDatePicker={setShowDatePicker}
                  disabled={taskIsCompleted}
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
              <UpdateTaskPriorityMenu
                disabled={taskIsCompleted}
                task={task}
                fullWidth
                variant="text"
                sx={{
                  ".MuiButton-endIcon": { flexGrow: 1, justifyContent: "end" },
                }}
              />
              <Divider sx={{ my: 1 }} />
              <UpdateTaskDialogTags task={task} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Menu
        sx={{ width: 320 }}
        anchorEl={anchorEl}
        id="task-menu"
        open={taskMenuOpen}
        onClose={onClose}
        onClick={onClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleDuplicateMenuItemClick}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleCopyMenuItemClick}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Copy Link to Task
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteMenuItemClick}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
