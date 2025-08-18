import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import { useUpdateTask } from "@shared/hooks/queries";
import type { Task } from "@shared/types/common";
import { generateTaskLink } from "@shared/utils";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import TaskDuplicateMenuItem from "./TaskDuplicateMenuItem";
import TaskMenuDatePicker from "./TaskMenuDatePicker";
import TaskMoveMenuItem from "./TaskMoveMenuItem";

export interface LabelViewTaskMenuProps {
  taskMenuAnchorEl: null | HTMLElement;
  task: Task;
  showAddTaskMenuItems?: boolean;
  handleAddTaskAbove?: () => void;
  handleAddTaskBelow?: () => void;
  handleCloseTaskMenu: () => void;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
}

export default function LabelViewTaskMenu({
  taskMenuAnchorEl,
  task,
  handleCloseTaskMenu,
  handleEditTask,
  handleDeleteTask,
}: LabelViewTaskMenuProps) {
  const navigate = useNavigate();
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const [datePickerAnchorEl, setDatePickerAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleGoToProject = (task: Task) => {
    handleCloseTaskMenu();
    navigate(`/project/${task.project}#task-${task.id}`);
  };

  const handleOpenDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDatePickerAnchorEl(e.currentTarget);
  };
  const handleCloseDatePicker = () => {
    setDatePickerAnchorEl(null);
  };

  const handleSetPriority = async (priority: Task["priority"]) => {
    await toast.promise(
      updateTask({
        priority,
      }),
      {
        loading: "Setting task priority...",
        success: "Successfully set task priority.",
        error: "Failed to set task priority.",
      },
    );
  };

  const handleSetDueDate = async (date: dayjs.Dayjs | null) => {
    handleCloseTaskMenu();
    handleCloseDatePicker();
    await toast.promise(
      updateTask({
        due_date: date,
      }),
      {
        loading: "Setting due date...",
        success: "Successfully set due date.",
        error: "Failed to set due date.",
      },
    );
  };

  const handleSetDueToday = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCloseTaskMenu();
    await toast.promise(
      updateTask({
        due_date: dayjs(),
      }),
      {
        loading: "Setting due date to today...",
        success: "Successfully set due date to today.",
        error: "Failed to set due date to today.",
      },
    );
  };
  const handleSetDueTomorrow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCloseTaskMenu();
    await toast.promise(
      updateTask({
        due_date: dayjs().add(1, "day"),
      }),
      {
        loading: "Setting due date to tomorrow...",
        success: "Successfully set due date to tomorrow.",
        error: "Failed to set due date to tomorrow.",
      },
    );
  };

  const handleSetDueNextWeekend = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCloseTaskMenu();
    const today = dayjs();
    const comingWeekend =
      today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);
    await toast.promise(
      updateTask({
        due_date: comingWeekend,
      }),
      {
        loading: "Setting due date to coming weekend...",
        success: "Successfully set due date to coming weekend.",
        error: "Failed to set due date to coming weekend.",
      },
    );
  };
  const handleRemoveDueDate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCloseTaskMenu();
    await toast.promise(
      updateTask({
        due_date: null,
      }),
      {
        loading: "Removing due date...",
        success: "Successfully removed due date.",
        error: "Failed to remove due date.",
      },
    );
  };
  return (
    <>
      <TaskMenuDatePicker
        task={task}
        anchorEl={datePickerAnchorEl}
        handleOnChange={handleSetDueDate}
        handleClose={handleCloseDatePicker}
      />
      <Menu
        id="task-menu"
        anchorEl={taskMenuAnchorEl}
        open={Boolean(taskMenuAnchorEl)}
        onClose={handleCloseTaskMenu}
        MenuListProps={{
          "aria-labelledby": `task-options-button-${task.id}`,
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEditTask(task);
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleGoToProject(task);
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Go to project" />
        </MenuItem>
        <MenuItem
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const taskLink = generateTaskLink(task.id);
              const fullUrl = `${window.location.origin}${taskLink}`;
              await navigator.clipboard.writeText(fullUrl);
              toast.success("Task link copied to clipboard!");
            } catch (error) {
              console.error("Failed to copy link:", error);
              toast.error("Failed to copy link to clipboard");
            }
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copy Link" />
        </MenuItem>
        <Divider component="li" />
        <MenuSection label="Date">
          <MenuItem disableRipple>
            <IconButton onClick={handleSetDueToday}>
              <TodayIcon />
            </IconButton>
            <IconButton onClick={handleSetDueTomorrow}>
              <WbSunnyIcon />
            </IconButton>
            <IconButton onClick={handleSetDueNextWeekend}>
              <WeekendIcon />
            </IconButton>
            {task.due_date && (
              <IconButton onClick={handleRemoveDueDate}>
                <NotInterestedIcon />
              </IconButton>
            )}
            <IconButton onClick={handleOpenDatePicker}>
              <MoreHorizIcon />
            </IconButton>
          </MenuItem>
        </MenuSection>
        <MenuSection label="Priority">
          <MenuItem disableRipple>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => handleSetPriority("HIGH")}>
                {task.priority === "HIGH" ? (
                  <FlagIcon color="error" />
                ) : (
                  <OutlinedFlagIcon color="error" />
                )}
              </IconButton>
              <IconButton onClick={() => handleSetPriority("MEDIUM")}>
                {task.priority === "MEDIUM" ? (
                  <FlagIcon color="warning" />
                ) : (
                  <OutlinedFlagIcon color="warning" />
                )}
              </IconButton>
              <IconButton onClick={() => handleSetPriority("LOW")}>
                {task.priority === "LOW" ? (
                  <FlagIcon color="info" />
                ) : (
                  <OutlinedFlagIcon color="info" />
                )}
              </IconButton>
              <IconButton onClick={() => handleSetPriority("NONE")}>
                {task.priority === "NONE" ? <FlagIcon /> : <OutlinedFlagIcon />}
              </IconButton>
            </Stack>
          </MenuItem>
        </MenuSection>
        <Divider component="li" />
        <TaskMoveMenuItem task={task} onClose={handleCloseTaskMenu} />
        <TaskDuplicateMenuItem task={task} onClose={handleCloseTaskMenu} />
        <Divider component="li" />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task);
            handleCloseTaskMenu();
          }}
          sx={{
            color: (theme) => theme.palette.error.main,
          }}
        >
          <ListItemIcon
            sx={{
              color: (theme) => theme.palette.error.main,
            }}
          >
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
}

function MenuSection({ children, label }: MenuSectionProps) {
  return (
    <MenuSectionRoot role="group">
      <MenuSectionLabel>{label}</MenuSectionLabel>
      <ul>{children}</ul>
    </MenuSectionRoot>
  );
}
interface MenuSectionProps {
  children: React.ReactNode;
  label: string;
}

const MenuSectionRoot = styled("li")`
  list-style: none;

  & > ul {
    padding-left: 0;
  }

  & .MuiMenuItem-root:hover {
    background-color: transparent;
  }
`;

const MenuSectionLabel = styled("span")(
  ({ theme }) => `
  display: block;
  padding: 10px 0 5px 10px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: ${theme.palette.text.secondary};
`,
);
