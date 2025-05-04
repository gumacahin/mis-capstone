import EventIcon from "@mui/icons-material/Event";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";

import useUpdateTaskDialogContext from "../hooks/useUpdateTaskDialogContext";
import { Task } from "../types/common";
import LabelViewTaskMenu from "./LabelViewTaskMenu";
import TaskCheckIcon from "./TaskCheckIcon";
import TaskDeleteDialog from "./TaskDeleteDialog";
import TaskForm from "./TaskForm";

export interface TaskCardProps {
  task: Task;
  hideDueDates?: boolean;
  showAddTaskMenuItems?: boolean;
}

export default function LabelViewTaskCard({
  task,
  hideDueDates = false,
  showAddTaskMenuItems = true,
}: TaskCardProps) {
  const { setTask } = useUpdateTaskDialogContext();
  const isOverdue =
    task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day");

  const [taskMenuAnchorEl, setTaskMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleTaskMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTaskMenuAnchorEl(event.currentTarget);
  };
  const handleCloseTaskMenu = () => {
    setTaskMenuAnchorEl(null);
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    handleCloseTaskMenu();
  };
  const handleCloseTaskEditForm = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
    handleCloseTaskMenu();
  };
  const handleCloseTaskDeleteDialog = () => {
    setDeletingTask(null);
  };

  const isEditingTask = editingTask != null;
  const isDeletingTask = deletingTask != null;
  return (
    <>
      {isEditingTask && (
        <TaskForm task={editingTask} handleClose={handleCloseTaskEditForm} />
      )}
      {isDeletingTask && (
        <TaskDeleteDialog
          task={deletingTask}
          handleClose={handleCloseTaskDeleteDialog}
        />
      )}
      <LabelViewTaskMenu
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        handleCloseTaskMenu={handleCloseTaskMenu}
        taskMenuAnchorEl={taskMenuAnchorEl}
        showAddTaskMenuItems={showAddTaskMenuItems}
        task={task}
      />
      {!isEditingTask && (
        <Card
          id={`task-${task.id}`}
          onClick={() => setTask(task)}
          sx={{
            width: "100%",
            maxWidth: "100%",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          key={task.id}
          variant="outlined"
        >
          <CardHeader
            avatar={<TaskCheckIcon task={task} />}
            sx={{
              "& .MuiCardHeader-root": { padding: 0 },
              "& .MuiCardHeader-content": { overflow: "hidden" },
            }}
            title={
              <Stack maxWidth={"100%"}>
                <Typography
                  sx={{
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: task.completion_date
                      ? "line-through"
                      : "default",
                    "& p": {
                      margin: 0,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: task.title,
                  }}
                />
                {task.description && (
                  <Typography
                    sx={{
                      textWrap: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textDecoration: task.completion_date
                        ? "line-through"
                        : "default",
                      "& p": {
                        margin: 0,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      },
                      fontSize: (theme) => theme.typography.body2.fontSize,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: task.description,
                    }}
                  />
                )}
              </Stack>
            }
            subheader={
              <Stack spacing={1} direction={"row"} alignItems={"center"}>
                {!hideDueDates && task.due_date && (
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    sx={isOverdue ? { color: "rgb(209, 69, 59)" } : {}}
                  >
                    <EventIcon fontSize="small" />
                    <Typography
                      ml="10px"
                      variant={"caption"}
                      sx={{
                        textWrap: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {dayjs(task.due_date).format("MMM D YYYY")}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            }
            action={
              <IconButton
                id={`task-options-button-${task.id}`}
                size="small"
                onClick={handleTaskMenuClick}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            }
          />
        </Card>
      )}
    </>
  );
}
