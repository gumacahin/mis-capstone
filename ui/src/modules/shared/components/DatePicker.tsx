import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import RepeatIcon from "@mui/icons-material/Repeat";
import PostponeIcon from "@mui/icons-material/Shortcut";
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
import {
  DateCalendar,
  type DateCalendarProps,
} from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { forwardRef, MouseEvent, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Frequency, RRule } from "rrule";

import useTimezoneContext from "../hooks/useTimezoneContext";
import type { TaskFormFields } from "../types/common";
import { getPostponeDate, getRepeatDates } from "../utils";
import CustomPickersDay from "./CustomPickersDay";
import NaturalLanguageInput from "./NaturalLanguageInput";
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
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const timezone = useTimezoneContext();

    const { watch, setValue } = useFormContext<TaskFormFields>();

    const dtstart = watch("dtstart");
    const rrule = watch("rrule");
    const open = Boolean(anchorEl);
    const isRepeating = rrule !== null;
    const dueDate = dtstart ? dayjs(dtstart).tz(timezone) : null;

    const id = open ? "calendar-popover" : undefined;

    const handleRemoveDueDate = () => {
      setValue("rrule", null);
      setValue("dtstart", null);
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

    const handleMonthChange = useCallback((newMonth: Dayjs) => {
      setCurrentMonth(newMonth.startOf("month"));
    }, []);

    // Calculate the displayed date range
    const getDisplayedDateRange = (month: Dayjs) => {
      const startOfMonth = month.startOf("month");
      const endOfMonth = month.endOf("month");
      return { start: startOfMonth, end: endOfMonth };
    };

    const { start, end } = getDisplayedDateRange(currentMonth);

    const handlePostpone = () => {
      setValue("dtstart", postponeDate);
      handleClose();
    };

    const handleDateChange = (picked: Dayjs | null) => {
      if (!picked) return;

      // 1) Work in user's timezone on the picked CALENDAR day
      let local = dayjs(picked).tz(timezone).startOf("day");

      // 2) Apply the time (from current selection, interpreted in user's tz)
      const base = dtstart ? dayjs(dtstart).tz(timezone) : null;
      const hour = base?.hour() ?? 0;
      const minute = base?.minute() ?? 0;

      local = local.hour(hour).minute(minute).second(0).millisecond(0);

      // 3) Store as UTC
      const utcValue = local.utc();
      setValue("dtstart", utcValue);

      if (!rrule) return;

      // === RRule update (same logic, but use `local` for day fields) ===
      const rruleObject = RRule.fromString(rrule);

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dtstart: _,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        byhour,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        byminute,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        bysecond,
        ...options
      } = rruleObject.options;

      switch (options.freq) {
        case Frequency.WEEKLY: {
          const dayOfWeek = (local.day() + 6) % 7; // dayjs->RRule
          if (!options.byweekday) options.byweekday = [dayOfWeek];
          else if (!options.byweekday.includes(dayOfWeek))
            options.byweekday = [...options.byweekday, dayOfWeek];
          break;
        }
        case Frequency.MONTHLY: {
          options.bymonthday = [local.date()];
          options.byweekday = [];
          options.bysetpos = [];
          break;
        }
        case Frequency.YEARLY: {
          options.bymonth = [local.month() + 1];
          options.bymonthday = [local.date()];
          options.byweekday = [];
          options.bysetpos = [];
          break;
        }
        case Frequency.DAILY:
          break;
      }

      const newRrule = new RRule(options);
      setValue("rrule", newRrule.toString());
    };

    const formatDayOfWeek = (date: Dayjs | null) => {
      if (date === null) return "Date";
      const givenDate = dayjs(date).tz(timezone);
      const today = dayjs().tz(timezone).startOf("day");
      const yesterday = today.subtract(1, "day");
      const tomorrow = today.add(1, "day");
      const sevenDaysFromNow = today.add(7, "day");

      // Check if time is not midnight (12:00 AM)
      const isMidnight = givenDate.hour() === 0 && givenDate.minute() === 0;

      // Format time if not midnight
      let timeStr = "";
      if (!isMidnight) {
        const hour = givenDate.hour();
        const minute = givenDate.minute();

        if (minute === 0) {
          // Only hour if minute is 00
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour < 12 ? "AM" : "PM";
          timeStr = ` ${displayHour}${ampm}`;
        } else {
          // Include minute if not 00
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour < 12 ? "AM" : "PM";
          timeStr = ` ${displayHour}:${minute.toString().padStart(2, "0")}${ampm}`;
        }
      }

      const dateOnly = givenDate.startOf("day");
      if (dateOnly.isSame(yesterday)) return "Yesterday" + timeStr;
      if (dateOnly.isSame(today)) return "Today" + timeStr;
      if (dateOnly.isSame(tomorrow)) return "Tomorrow" + timeStr;
      if (dateOnly.isBetween(today, sevenDaysFromNow, null, "[]"))
        return givenDate.format("dddd") + timeStr;
      return givenDate.format("MMMM D") + timeStr;
    };

    const todayLocal = dayjs().tz(timezone).startOf("day");

    const today = todayLocal; // local
    const tomorrow = todayLocal.add(1, "day");
    const nextWeek = todayLocal.add(7, "day");
    const comingWeekend =
      todayLocal.day() >= 6
        ? todayLocal.add(1, "week").day(6).startOf("day") // next Saturday
        : todayLocal.day(6).startOf("day"); // this Saturday

    const postponeDate = rrule
      ? getPostponeDate(RRule.fromString(rrule), dtstart, timezone)
      : null;

    const repeatDates = rrule
      ? getRepeatDates(RRule.fromString(rrule), start, end, timezone)
      : [];

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
              endIcon={isRepeating ? <RepeatIcon /> : undefined}
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
            vertical: "center",
            horizontal: "center",
          }}
        >
          <List>
            <NaturalLanguageInput />
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
              secondaryAction={comingWeekend.format("ddd MMM D")}
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
            <ListItem
              disablePadding
              secondaryAction={nextWeek.format("ddd MMM D")}
            >
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
            {isRepeating && (
              <ListItem
                disablePadding
                secondaryAction={postponeDate.tz(timezone).format("ddd MMM D")}
              >
                <ListItemButton onClick={handlePostpone}>
                  <ListItemIcon>
                    <PostponeIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Postpone"} />
                </ListItemButton>
              </ListItem>
            )}
            {dueDate && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setValue("dtstart", null);
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
              <DateCalendar
                disablePast
                value={dueDate}
                onMonthChange={handleMonthChange}
                onChange={(value: Dayjs) => {
                  handleDateChange(value);
                }}
                slots={{
                  day: (props) => (
                    <CustomPickersDay
                      {...props}
                      highlightedDates={repeatDates}
                    />
                  ),
                }}
              />
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
