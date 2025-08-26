import NextWeekIcon from "@mui/icons-material/NextWeek";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import RepeatSelectionItem from "@shared/components/RepeatSelectionItem";
import { SmartDateTimeField } from "@shared/components/SmartDateTimeField";
import TimeSelectionItem from "@shared/components/TimeSelectionItem";
import { Task } from "@shared/types/common";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export default function TaskMenuDatePicker({
  task,
  handleOnChange,
  anchorEl,
  handleClose,
}: {
  task: Task;
  handleOnChange: (
    date: Dayjs | null,
    recurrence?: string | null,
    anchorMode?: "SCHEDULED" | "COMPLETED",
  ) => void;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
}) {
  const today = dayjs().startOf("day");
  const nextWeek = today.add(7, "day");
  const comingWeekend =
    today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);

  // Get the current due date for display
  const dueDate = task.due_date ? dayjs(task.due_date) : null;

  // Local state for recurrence
  const [recurrence, setRecurrence] = useState<string | null>(
    task.recurrence || null,
  );
  const [anchorMode, setAnchorMode] = useState<"SCHEDULED" | "COMPLETED">(
    task.recurrence_anchor_mode || "SCHEDULED",
  );

  return (
    <Popover
      open={Boolean(anchorEl)}
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
              handleOnChange(newDate, newRecurrence || recurrence, anchorMode);
            }}
            recurrence={recurrence}
            recurrenceAnchorMode={anchorMode}
            onRecurrenceChange={(newRecurrence) => {
              setRecurrence(newRecurrence);
              if (dueDate) {
                handleOnChange(dueDate, newRecurrence, anchorMode);
              }
            }}
            onAnchorModeChange={(newAnchorMode) => {
              setAnchorMode(newAnchorMode);
              if (dueDate) {
                handleOnChange(dueDate, recurrence, newAnchorMode);
              }
            }}
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleOnChange(today);
              handleClose();
            }}
          >
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary={"Today"} />
            <ListItemSecondaryAction>
              {dayjs().format("ddd")}
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              const tomorrow = today.add(1, "day");
              handleOnChange(tomorrow);
              handleClose();
            }}
          >
            <ListItemIcon>
              <WbSunnyIcon />
            </ListItemIcon>
            <ListItemText primary={"Tomorrow"} />
            <ListItemSecondaryAction>
              {dayjs().add(1, "day").format("ddd")}
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleOnChange(comingWeekend);
              handleClose();
            }}
          >
            <ListItemIcon>
              <WeekendIcon />
            </ListItemIcon>
            <ListItemText primary={"This weekend"} />
            <ListItemSecondaryAction>
              {comingWeekend.format("ddd")}
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleOnChange(nextWeek);
              handleClose();
            }}
          >
            <ListItemIcon>
              <NextWeekIcon />
            </ListItemIcon>
            <ListItemText primary={"Next Week"} />
            <ListItemSecondaryAction>
              {nextWeek.format("ddd MMM D")}
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        {task.due_date && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleOnChange(null);
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
          defaultValue={task.due_date ? dayjs(task.due_date) : null}
          onChange={(newDate: Dayjs | null) => {
            if (newDate) {
              handleOnChange(newDate.startOf("day"));
            } else {
              handleOnChange(null);
            }
            handleClose();
          }}
        />
      </LocalizationProvider>

      {/* Time button below calendar */}
      <TimeSelectionItem value={dueDate} onChange={handleOnChange} />

      {/* Repeat button below time */}
      <RepeatSelectionItem
        value={recurrence}
        onChange={(repeat) => {
          setRecurrence(repeat);
          // Update the task with the new recurrence
          if (dueDate) {
            handleOnChange(dueDate, repeat, anchorMode);
          }
        }}
        selectedDate={dueDate}
        anchorMode={anchorMode}
        onAnchorModeChange={(mode) => {
          setAnchorMode(mode);
          // Update the task with the new anchor mode
          if (dueDate) {
            handleOnChange(dueDate, recurrence, mode);
          }
        }}
      />
    </Popover>
  );
}
