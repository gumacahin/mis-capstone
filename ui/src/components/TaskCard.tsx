import AddCommentIcon from "@mui/icons-material/AddComment";
import CreateIcon from "@mui/icons-material/Create";
import EventIcon from "@mui/icons-material/Event";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";

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
  ref?: React.Ref<HTMLDivElement>;
}

export default function TaskCard({
  task,
  handleOpenTask,
  hideDueDates = false,
  handleAddTaskAbove,
  handleAddTaskBelow,
  ref,
}: TaskCardProps) {
  const isOverdue =
    task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day");

  const [taskMenuAnchorEl, setTaskMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const handleTaskMenuClick = (event: React.MouseEvent<HTMLElement>) => {
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
      <TaskMenu
        handleAddTaskAbove={handleAddTaskAbove}
        handleAddTaskBelow={handleAddTaskBelow}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        handleCloseTaskMenu={handleCloseTaskMenu}
        taskMenuAnchorEl={taskMenuAnchorEl}
        task={task}
      />
      <div ref={ref}>
        <Card
          component={"div"}
          sx={{ width: "100%", maxWidth: "100%" }}
          key={task.id}
          variant="outlined"
        >
          <CardActionArea
            onClick={() => {
              handleOpenTask(task.id);
            }}
          >
            <CardHeader
              avatar={<TaskCheckIcon task={task} />}
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
                <Stack
                  // pt={1}
                  // pl={5}
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                >
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
                        }}
                      >
                        {dayjs(task.due_date).format("MMM D YYYY")}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              }
              action={
                <Stack direction={"row"} alignItems={"center"}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CreateIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <EventIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <AddCommentIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    id={`task-options-button-${task.id}`}
                    size="small"
                    onClick={handleTaskMenuClick}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            />
          </CardActionArea>
        </Card>
      </div>
    </>
  );
}
