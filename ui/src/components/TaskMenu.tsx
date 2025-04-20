import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TodayIcon from "@mui/icons-material/Today";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";
import { toast } from "react-hot-toast";

import { useUpdateTask } from "../api";
import type { Task } from "../types/common";
import TaskMenuDatePicker from "./TaskMenuDatePicker";

export interface TaskMenuProps {
  taskMenuAnchorEl: null | HTMLElement;
  task: Task;
  showAddTaskMenuItems?: boolean;
  handleAddTaskAbove?: () => void;
  handleAddTaskBelow?: () => void;
  handleCloseTaskMenu: () => void;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
}

export default function TaskMenu({
  showAddTaskMenuItems = true,
  taskMenuAnchorEl,
  task,
  handleAddTaskAbove,
  handleAddTaskBelow,
  handleCloseTaskMenu,
  handleEditTask,
  handleDeleteTask,
}: TaskMenuProps) {
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const [datePickerAnchorEl, setDatePickerAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleOpenDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDatePickerAnchorEl(e.currentTarget);
  };
  const handleCloseDatePicker = () => {
    setDatePickerAnchorEl(null);
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
        {showAddTaskMenuItems && (
          <>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (handleAddTaskAbove) {
                  handleAddTaskAbove();
                }
                handleCloseTaskMenu();
              }}
            >
              <ListItemIcon>
                <VerticalAlignTopIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Add task above" />
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (handleAddTaskBelow) {
                  handleAddTaskBelow();
                }
                handleCloseTaskMenu();
              }}
            >
              <ListItemIcon>
                <VerticalAlignBottomIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Add task below" />
            </MenuItem>
            <Divider component="li" />
          </>
        )}
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
        <Divider component="li" />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task);
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
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
