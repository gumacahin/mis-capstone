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
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";

// type DatePickerProps = React.ComponentProps<typeof DatePicker>;

export default function DueDatePicker({
  defaultValue,
}: {
  defaultValue?: Date;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ? dayjs(defaultValue).toDate() : null,
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? "calendar-popover" : undefined;

  const formatDayOfWeek = (date: Date | null) => {
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
    <>
      <input
        type="hidden"
        name="due_date"
        value={selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : ""}
      />
      <ButtonGroup variant="outlined" size="small">
        <Button variant="outlined" onClick={handleClick} size="small">
          {formatDayOfWeek(selectedDate)}
        </Button>
        {selectedDate && (
          <Button variant="outlined" onClick={() => setSelectedDate(null)}>
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
                setSelectedDate(dayjs().toDate());
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
                setSelectedDate(dayjs().add(1, "day").toDate());
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
                setSelectedDate(dayjs().startOf("week").add(6, "day").toDate());
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
                setSelectedDate(dayjs().add(7, "day").toDate());
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
          {selectedDate && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedDate(null);
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
            onChange={(date) => {
              setSelectedDate(date);
              handleClose();
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
}
