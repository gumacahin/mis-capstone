import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EventIcon from "@mui/icons-material/Event";
import InboxIcon from "@mui/icons-material/Inbox";
import LabelIcon from "@mui/icons-material/Label";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TagIcon from "@mui/icons-material/Tag";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useProfile } from "@shared/hooks/queries";
import useUpdateTaskDialogContext from "@shared/hooks/useUpdateTaskDialogContext";
import { Project, Task } from "@shared/types/common";
import { formatDayOfWeek } from "@shared/utils";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";

import TaskCardDescription from "./TaskCardDescription";
import TaskCheckIcon from "./TaskCheckIcon";
import TaskDeleteDialog from "./TaskDeleteDialog";
import TaskForm from "./TaskForm";
import TaskMenu from "./TaskMenu";

export interface TaskCardProps {
  task: Task;
  hideDueDates?: boolean;
  hideProject?: boolean;
  handleAddTaskAbove: () => void;
  handleAddTaskBelow: () => void;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  showAddTaskMenuItems?: boolean;
}

export default function TaskCard({
  task,
  hideDueDates = false,
  hideProject = false,
  handleAddTaskAbove,
  handleAddTaskBelow,
  provided,
  snapshot,
  showAddTaskMenuItems = true,
}: TaskCardProps) {
  const { setTask } = useUpdateTaskDialogContext();
  const { data: profile } = useProfile();

  const project: Project = profile?.projects.find(
    (project: { id: number }) => project.id === task.project,
  );
  const section = project?.sections.find(
    (section: { id: number }) => section.id === task.section,
  );

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
      setTask(task);
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
          id={`task-${task.id}`}
          sx={{
            width: "100%",
            maxWidth: "100%",
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
            sx={{
              "& .MuiCardHeader-root": { padding: 0 },
              "& .MuiCardHeader-content": { overflow: "hidden" },
              "& .MuiCardHeader-avatar": { marginRight: 0 },
              "& .MuiIconButton-root": { paddingLeft: 0 },
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
                {task.description && <TaskCardDescription task={task} />}
              </Stack>
            }
            subheader={
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack
                  direction={"row"}
                  spacing={0.5}
                  alignItems={"center"}
                  sx={{ flexGrow: 1 }}
                >
                  <Stack spacing={1.5} direction={"row"} alignItems={"center"}>
                    {!hideDueDates && task.due_date && (
                      <Stack
                        direction={"row"}
                        spacing={0.5}
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
                          {formatDayOfWeek(dayjs(task.due_date))}
                        </Typography>
                      </Stack>
                    )}
                    {task.comments_count > 0 && (
                      <Stack
                        direction={"row"}
                        spacing={0.5}
                        alignItems={"center"}
                      >
                        <ChatBubbleIcon fontSize="small" />
                        <Typography variant="caption">
                          {task.comments_count}
                        </Typography>
                      </Stack>
                    )}
                    {task.tags.length > 0 && (
                      <Stack
                        spacing={0}
                        direction={"row"}
                        alignItems={"center"}
                      >
                        <Stack direction={"row"} alignItems={"center"}>
                          <LabelIcon fontSize="small" />
                          <Typography noWrap variant="caption">
                            {task.tags[0]}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          noWrap
                        >{` + ${task.tags.length - 1}`}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                {!hideProject && (
                  <Stack direction={"row"} alignItems={"center"}>
                    {project?.is_default ? (
                      <InboxIcon fontSize="small" />
                    ) : (
                      <TagIcon fontSize="small" />
                    )}
                    <Typography noWrap variant="caption">
                      {project?.title}
                    </Typography>
                    {section && !section.is_default && (
                      <Typography noWrap variant="caption">
                        /{section.title}
                      </Typography>
                    )}
                  </Stack>
                )}
              </Box>
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
