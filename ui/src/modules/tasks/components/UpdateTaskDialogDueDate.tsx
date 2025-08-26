import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import Button from "@mui/material/Button";
import ButtonGroup, { type ButtonGroupProps } from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateCalendar,
  type DateCalendarProps,
} from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useUpdateTask } from "@shared/hooks/queries";
import { Task } from "@shared/types/common";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, MouseEvent, useState } from "react";
import toast from "react-hot-toast";

import RepeatSelectionItem from "../../shared/components/RepeatSelectionItem";
import { SmartDateTimeField } from "../../shared/components/SmartDateTimeField";
import TimeSelectionItem from "../../shared/components/TimeSelectionItem";

type DatePickerProps = DateCalendarProps<Dayjs> & {
  task: Task;
  setShowDatePicker: (show: boolean) => void;
} & ButtonGroupProps;

const UpdateTaskDialogDudeDate = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ task, setShowDatePicker, sx, ...props }, ref) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutateAsync: updateTask } = useUpdateTask(task);

    // Local state for recurrence
    const [recurrence, setRecurrence] = useState<string | null>(
      task.recurrence || null,
    );
    const [anchorMode, setAnchorMode] = useState<"SCHEDULED" | "COMPLETED">(
      task.recurrence_anchor_mode || "SCHEDULED",
    );

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleChange = async (
      newDueDate: Dayjs | null,
      newRecurrence?: string | null,
      newAnchorMode?: "SCHEDULED" | "COMPLETED",
    ) => {
      setIsSubmitting(true);
      await toast.promise(
        updateTask({
          due_date: newDueDate,
          recurrence: newRecurrence !== undefined ? newRecurrence : recurrence,
          recurrence_anchor_mode:
            newAnchorMode !== undefined ? newAnchorMode : anchorMode,
        }),
        {
          loading: "Updating task due date...",
          success: "Task due date updated successfully!",
          error: "Failed to update task due date.",
        },
      );
      setIsSubmitting(false);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setShowDatePicker(!!task.due_date);
    };

    const open = Boolean(anchorEl);

    const id = open ? "calendar-popover" : undefined;

    const dueDate = task.due_date ? dayjs(task.due_date) : null;

    const formatDayOfWeek = (date: Dayjs | null) => {
      if (date === null) {
        return "Date";
      }
      const givenDate = dayjs(date).startOf("day");
      const yesterday = dayjs().subtract(1, "day").startOf("day");
      const today = dayjs().startOf("day");
      const tomorrow = dayjs().add(1, "day").startOf("day");
      const sevenDaysFromNow = dayjs().add(7, "day").startOf("day"); // End on Sun

      let dateText = "";
      if (givenDate.isSame(yesterday)) {
        dateText = "Yesterday";
      } else if (givenDate.isSame(today)) {
        dateText = "Today";
      } else if (givenDate.isSame(tomorrow)) {
        dateText = "Tomorrow";
      } else if (
        givenDate.isAfter(today) &&
        givenDate.isBefore(sevenDaysFromNow)
      ) {
        dateText = dayjs(date).format("dddd");
      } else {
        dateText = dayjs(date).format("MMMM D");
      }

      // Add time if it's not midnight
      if (date.hour() !== 0 || date.minute() !== 0) {
        dateText += ` ${date.format("h:mm A")}`;
      }

      return dateText;
    };

    const today = dayjs().startOf("day");
    const tomorrow = dayjs().add(1, "day").startOf("day");
    const nextWeek = dayjs().add(7, "day").startOf("day");
    const comingWeekend =
      today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);

    return (
      <>
        <ButtonGroup
          size="small"
          {...props}
          sx={[
            {
              "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                borderRight: props.variant === "text" ? "none" : undefined,
              },
              "& .MuiButtonGroup-grouped:not(:first-of-type)": {
                marginLeft: props.variant === "text" ? 0 : undefined,
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Tooltip title="Set due date">
            <Button
              disabled={isSubmitting}
              sx={{
                flexGrow: 1,
                flexShrink: 1,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                ...(props.fullWidth && { justifyContent: "start" }),
              }}
              startIcon={<CalendarTodayIcon />}
              variant={props.variant ?? "outlined"}
              onClick={handleClick}
              ref={ref}
              size="small"
            >
              {formatDayOfWeek(dueDate)}
            </Button>
          </Tooltip>
          {dueDate && (
            <Tooltip title="Remove due date">
              <Button
                disabled={isSubmitting}
                sx={{
                  flexGrow: 0,
                  flexShrink: 0,
                  width: "auto",
                }}
                size="small"
                variant={props.variant ?? "outlined"}
                onClick={() => handleChange(null)}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </Tooltip>
          )}
        </ButtonGroup>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem divider>
              <SmartDateTimeField
                value={dueDate}
                onChange={(newDate, newRecurrence) => {
                  handleChange(
                    newDate,
                    newRecurrence || recurrence,
                    anchorMode,
                  );
                }}
                recurrence={recurrence}
                recurrenceAnchorMode={anchorMode}
                onRecurrenceChange={(newRecurrence) => {
                  setRecurrence(newRecurrence);
                  if (dueDate) {
                    handleChange(dueDate, newRecurrence, anchorMode);
                  }
                }}
                onAnchorModeChange={(newAnchorMode) => {
                  setAnchorMode(newAnchorMode);
                  if (dueDate) {
                    handleChange(dueDate, recurrence, newAnchorMode);
                  }
                }}
              />
            </ListItem>
            <ListItem disablePadding secondaryAction={dayjs().format("ddd")}>
              <ListItemButton
                onClick={() => {
                  handleChange(today);
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText primary={"Today"} />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              secondaryAction={dayjs().add(1, "day").format("ddd")}
            >
              <ListItemButton
                onClick={() => {
                  handleChange(tomorrow);
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <WbSunnyIcon />
                </ListItemIcon>
                <ListItemText primary={"Tomorrow"} />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              secondaryAction={comingWeekend.format("ddd")}
            >
              <ListItemButton
                onClick={() => {
                  handleChange(comingWeekend.startOf("day"));
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <WeekendIcon />
                </ListItemIcon>
                <ListItemText primary={"This weekend"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding secondaryAction={nextWeek.format("ddd")}>
              <ListItemButton
                onClick={() => {
                  handleChange(nextWeek.startOf("day"));
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <NextWeekIcon />
                </ListItemIcon>
                <ListItemText primary={"Next Week"} />
              </ListItemButton>
            </ListItem>

            {dueDate && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleChange(null);
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <NotInterestedIcon />
                  </ListItemIcon>
                  <ListItemText primary={"No date"} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              disablePast
              value={dueDate}
              onChange={(newDate: Dayjs | null) => {
                if (newDate) {
                  handleChange(newDate.startOf("day"));
                } else {
                  handleChange(null);
                }
                handleClose();
              }}
            />
          </LocalizationProvider>

          {/* Time button below calendar */}
          <TimeSelectionItem value={dueDate} onChange={handleChange} />

          {/* Repeat button below time */}
          <RepeatSelectionItem
            value={recurrence}
            onChange={(repeat) => {
              setRecurrence(repeat);
              // Update the task with the new recurrence
              if (dueDate) {
                handleChange(dueDate, repeat, anchorMode);
              }
            }}
            selectedDate={dueDate}
            anchorMode={anchorMode}
            onAnchorModeChange={(mode) => {
              setAnchorMode(mode);
              // Update the task with the new anchor mode
              if (dueDate) {
                handleChange(dueDate, recurrence, mode);
              }
            }}
          />
        </Popover>
      </>
    );
  },
);

UpdateTaskDialogDudeDate.displayName = "UpdateTaskDialogDueDate";
export default UpdateTaskDialogDudeDate;
