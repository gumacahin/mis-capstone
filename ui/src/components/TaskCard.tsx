import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import EventIcon from "@mui/icons-material/Event";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";

import { Task } from "../types/common";
import TaskCheckIcon from "./TaskCheckIcon";
import TaskDeleteDialog from "./TaskDeleteDialog";
import TaskForm from "./TaskForm";
import TaskMenu from "./TaskMenu";

export interface TaskCardProps {
  task: Task;
  handleOpenTask: (taskId: number) => void;
  hideDueDates?: boolean;
  handleAddTaskAbove: () => void;
  handleAddTaskBelow: () => void;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  showAddTaskMenuItems?: boolean;
}

export default function TaskCard({
  task,
  handleOpenTask,
  hideDueDates = false,
  handleAddTaskAbove,
  handleAddTaskBelow,
  provided,
  snapshot,
  showAddTaskMenuItems = true,
}: TaskCardProps) {
  const isOverdue =
    task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day");

  const [isDragging, setIsDragging] = useState(false);

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

  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      return;
    }
    if (
      e.target instanceof HTMLElement &&
      e.target.closest(".MuiCardHeader-root")
    ) {
      handleOpenTask(task.id);
    }
  };

  if (snapshot.isDragging !== isDragging) {
    setIsDragging(snapshot.isDragging);
  }

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
      <TaskMenu
        handleAddTaskAbove={handleAddTaskAbove}
        handleAddTaskBelow={handleAddTaskBelow}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        handleCloseTaskMenu={handleCloseTaskMenu}
        taskMenuAnchorEl={taskMenuAnchorEl}
        showAddTaskMenuItems={showAddTaskMenuItems}
        task={task}
      />
      {!isEditingTask && (
        <Card
          sx={{
            width: "100%",
            maxWidth: "100%",
            // height: TASK_CARD_HEIGHT,
            "&:hover": {
              cursor: "pointer",
            },
          }}
          key={task.id}
          variant="outlined"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClickCapture={handleClickCapture}
        >
          <CardHeader
            avatar={<TaskCheckIcon task={task} />}
            sx={{ "& .MuiCardHeader-root": { padding: 0 } }}
            title={
              <Stack direction={"row"}>
                <Stack>
                  <Typography
                    sx={{
                      textDecoration: task.completion_date
                        ? "line-through"
                        : "default",
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    sx={{
                      textWrap: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: 14,
                      fontWeight: 400,
                      textDecoration: task.completion_date
                        ? "line-through"
                        : "default",
                    }}
                  >
                    {task.description}
                  </Typography>
                </Stack>
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
