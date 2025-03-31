import NextWeekIcon from "@mui/icons-material/NextWeek";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import Button from "@mui/material/Button";
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
import dayjs from "dayjs";
import { type MouseEvent, useState } from "react";
import toast from "react-hot-toast";

import { useRescheduleTasks } from "../api";
import { ITask } from "../types/common";

export default function RescheduleDialog({ tasks }: { tasks: ITask[] }) {
  const rescheduleTasks = useRescheduleTasks(tasks);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReschedule = (date: Date | null) => {
    if (!date) {
      return;
    }
    const updatedTasks = tasks.map((task: ITask) => {
      task.due_date = dayjs(date).format("YYYY-MM-DD");
      return task;
    });
    toast.promise(rescheduleTasks.mutateAsync(updatedTasks), {
      loading: "Rescheduling tasks...",
      success: "Tasks rescheduled successfully!",
      error: "Error rescheduling task.",
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "reschedule-popover" : undefined;
  return (
    // FIXME: This is an a11y issue. The div should be a button.
    // eslint-disable-next-line
    <div onClick={(e) => e.stopPropagation()}>
      <Button onClick={handleClick} size="small">
        Reschedule
      </Button>
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
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(dayjs().toDate());
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
                handleReschedule(dayjs().add(1, "day").toDate());
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
                handleReschedule(
                  dayjs().startOf("week").add(6, "day").toDate(),
                );
                handleClose();
              }}
            >
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={"This weekend"} />
              <ListItemSecondaryAction>
                {dayjs().startOf("week").add(6, "day").format("ddd")}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(dayjs().add(7, "day").toDate());
                handleClose();
              }}
            >
              <ListItemIcon>
                <NextWeekIcon />
              </ListItemIcon>
              <ListItemText primary={"Next Week"} />
              <ListItemSecondaryAction>
                {dayjs().add(7, "day").format("ddd MMM D")}{" "}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        </List>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            disablePast
            onChange={(date) => {
              handleReschedule(date);
              handleClose();
            }}
          />
        </LocalizationProvider>
      </Popover>
    </div>
  );
}
