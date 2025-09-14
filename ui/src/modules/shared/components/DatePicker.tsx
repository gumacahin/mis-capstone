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
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { forwardRef, MouseEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Frequency, RRule } from "rrule";

import useTimezoneContext from "../hooks/useTimezoneContext";
import type { TaskFormFields } from "../types/common";
import RepeatOptions from "./RepeatOptions";
import TimeOptions from "./TimeOptions";

type DatePickerProps = DateCalendarProps<Dayjs> & {
  onClose?: () => void;
} & ButtonGroupProps;

dayjs.extend(utc);
dayjs.extend(timezone);

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ sx, onClose, ...props }, ref) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const timezone = useTimezoneContext();

    const { watch, setValue } = useFormContext<TaskFormFields>();

    const dtstartLocal = watch("dtstart_local");
    const rrule = watch("rrule");
    const open = Boolean(anchorEl);

    console.log("=== RRule STRING ===", rrule);

    const id = open ? "calendar-popover" : undefined;

    const handleRemoveDueDate = () => {
      setValue("rrule", null);
      setValue("dtstart_local", null);
      setValue("anchor_mode", null);
    };
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      if (onClose) {
        onClose();
      }
    };
    const handleDateChange = (newDate: Dayjs | null) => {
      if (!newDate) return;
      const hour = dtstartLocal?.hour() || 0;
      const minute = dtstartLocal?.minute() || 0;
      newDate = newDate.hour(hour).minute(minute);
      setValue("dtstart_local", newDate);

      if (!rrule) return;

      // Parse existing RRule
      const rruleObject = RRule.fromString(rrule);
      console.log("=== RRule!!!!!!! ===", rrule);
      console.log("=== RRule Object ===", rruleObject.options);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dtstart, byhour, byminute, bysecond, ...options } =
        rruleObject.options;
      console.log("=== Options ===", options);

      // Update options based on frequency and selected date
      switch (options.freq) {
        case Frequency.WEEKLY: {
          // Update byweekday to include the selected day
          const dayOfWeek = (newDate.day() + 6) % 7; // Convert dayjs to RRule day
          if (!options.byweekday) {
            options.byweekday = [dayOfWeek];
          } else if (!options.byweekday.includes(dayOfWeek)) {
            options.byweekday = [...options.byweekday, dayOfWeek];
          }
          break;
        }

        case Frequency.MONTHLY: {
          // Update bymonthday to the selected date
          options.bymonthday = [newDate.date()];
          // Clear weekday options if they exist
          options.byweekday = [];
          options.bysetpos = [];
          break;
        }

        case Frequency.YEARLY: {
          // Update bymonth and bymonthday to the selected date
          options.bymonth = [newDate.month() + 1];
          options.bymonthday = [newDate.date()];
          // Clear weekday options if they exist
          options.byweekday = [];
          options.bysetpos = [];
          break;
        }

        case Frequency.DAILY:
          // No changes needed for daily
          break;
      }

      // Create new RRule and update
      const newRrule = new RRule(options);
      setValue("rrule", newRrule.toString());
    };

    const formatDayOfWeek = (date: Dayjs | null) => {
      if (date === null) {
        return "Date";
      }
      const givenDate = dayjs.utc(date).tz(timezone).startOf("day");
      const today = dayjs.utc(dayjs()).tz(timezone).startOf("day");
      const yesterday = today.subtract(1, "day").startOf("day");
      const tomorrow = today.add(1, "day").startOf("day");
      const sevenDaysFromNow = today.add(7, "day").startOf("day");
      if (givenDate.isSame(yesterday)) {
        return "Yesterday";
      }
      if (givenDate.isSame(today)) {
        return "Today";
      }
      if (givenDate.isSame(tomorrow)) {
        return "Tomorrow";
      }
      if (givenDate.isBetween(today, sevenDaysFromNow, null, "[]")) {
        return givenDate.format("dddd");
      }
      return givenDate.format("MMMM D");
    };

    const dueDate = dtstartLocal ? dayjs.utc(dtstartLocal).tz(timezone) : null;
    const today = dayjs.utc(dayjs()).tz(timezone).startOf("day");
    const tomorrow = today.add(1, "day").startOf("day");
    const nextWeek = today.add(7, "day").startOf("day");
    const comingWeekend =
      today.day() >= 6
        ? today.add(1, "week").day(6).startOf("day")
        : today.day(6).startOf("day");

    return (
      <>
        <ButtonGroup
          size="small"
          {...props}
          sx={[
            {
              "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                borderRight: props.variant === "text" ? "none" : undefined, // Remove dividers for text variant
              },
              "& .MuiButtonGroup-grouped:not(:first-of-type)": {
                marginLeft: props.variant === "text" ? 0 : undefined, // Remove spacing for text variant
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]), // Ensure sx is an array
          ]}
        >
          <Tooltip title="Set due date">
            <Button
              sx={{
                flexGrow: 1, // Allow this button to grow and occupy remaining space
                flexShrink: 1, // Allow it to shrink if needed
                textOverflow: "ellipsis", // Handle overflow gracefully
                overflow: "hidden", // Hide overflowing text
                whiteSpace: "nowrap", // Prevent text wrapping
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
                sx={{
                  flexGrow: 0, // Prevent this button from growing
                  flexShrink: 0, // Prevent this button from shrinking
                  width: "auto", // Ensure it only takes up the space it needs
                }}
                size="small"
                variant={props.variant ?? "outlined"}
                onClick={handleRemoveDueDate}
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
            <ListItem disablePadding secondaryAction={today.format("ddd")}>
              <ListItemButton
                onClick={() => {
                  handleDateChange(today);
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText primary={"Today"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding secondaryAction={tomorrow.format("ddd")}>
              <ListItemButton
                onClick={() => {
                  handleDateChange(tomorrow);
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
                  handleDateChange(comingWeekend);
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
                  handleDateChange(nextWeek);
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
                    setValue("dtstart_local", null);
                    setValue("rrule", null);
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
            <ListItem disablePadding>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  disablePast
                  value={dueDate}
                  onChange={(value: Dayjs) => {
                    handleDateChange(value);
                  }}
                />
              </LocalizationProvider>
            </ListItem>
            <TimeOptions />
            <RepeatOptions />
          </List>
        </Popover>
      </>
    );
  },
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
