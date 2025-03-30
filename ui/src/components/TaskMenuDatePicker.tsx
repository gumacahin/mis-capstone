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
import dayjs, { Dayjs } from "dayjs";

import { Task } from "../types/common";

export default function TaskMenuDatePicker({
  task,
  handleOnChange,
  anchorEl,
  handleClose,
}: {
  task: Task;
  handleOnChange: (date: Dayjs | null) => void;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
}) {
  const today = dayjs();
  const nextWeek = today.add(7, "day");
  const comingWeekend =
    today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);
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
            handleOnChange(newDate);
            handleClose();
          }}
        />
      </LocalizationProvider>
    </Popover>
  );
}
