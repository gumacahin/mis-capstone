import CloseIcon from "@mui/icons-material/Close";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateCalendar,
  type DateCalendarProps,
} from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { MouseEvent, useState } from "react";
import { type Control, Controller } from "react-hook-form";

import type { FormValues } from "./AddTodoDialog";

type DueDatePickerProps = DateCalendarProps<Dayjs> & {
  control: Control<FormValues>;
};

export default function DueDatePicker(props: DueDatePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const id = open ? "calendar-popover" : undefined;

  const formatDayOfWeek = (date: Dayjs | null) => {
    if (date === null) {
      return "No due date";
    }
    const givenDate = dayjs(date).startOf("day");
    const today = dayjs().startOf("day");
    const tomorrow = dayjs().add(1, "day").startOf("day");
    const sevenDaysFromNow = dayjs().add(7, "day").startOf("day"); // End on Sun
    if (givenDate.isSame(today)) {
      return "Today";
    }
    if (givenDate.isSame(tomorrow)) {
      return "Tomorrow";
    }
    if (givenDate.isBetween(today, sevenDaysFromNow, null, "[]")) {
      return dayjs(date).format("dddd");
    }
    return dayjs(date).format("MMMM D");
  };

  return (
    <Controller
      name="due_date"
      control={props.control}
      render={({ field }) => (
        <>
          <ButtonGroup variant="outlined" size="small">
            <Button variant="outlined" onClick={handleClick} size="small">
              {formatDayOfWeek(props.dueDate)}
            </Button>
            {field.value && (
              <Button
                variant="outlined"
                onClick={() => {
                  field.onChange(null);
                }}
              >
                <CloseIcon />
              </Button>
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
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    field.onChange(dayjs());
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
                    const tomorrow = dayjs().add(1, "day");
                    field.onChange(tomorrow);
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
                    const weekend = dayjs().startOf("week").add(6, "day");
                    field.onChange(weekend);
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
                    const nextWeek = dayjs().add(7, "day");
                    field.onChange(nextWeek);
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
              {field.value && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      field.onChange(null);
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
                value={field.value}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  handleClose();
                }}
              />
            </LocalizationProvider>
          </Popover>
        </>
      )}
    />
  );
}
