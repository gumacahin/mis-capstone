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
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateCalendar,
  type DateCalendarProps,
} from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";
import { forwardRef, MouseEvent, useMemo, useState } from "react";
import { type Control, Controller } from "react-hook-form";

import { useTimezone } from "../hooks/useTimezone";
import type { TaskFormFields } from "../types/common";
import {
  parseNaturalLanguage,
  parseRRuleToDate,
  updateRRuleWithDate,
} from "../utils/rrule";
import ParsedRRuleListItem from "./ParsedRRuleListItem";
import RepeatOptionListItem from "./RepeatOptionListItem";
import TimeOptionListItem from "./TimeOptionListItem";

type DatePickerProps = DateCalendarProps<Dayjs> & {
  control: Control<TaskFormFields>;
  onClose?: () => void;
} & ButtonGroupProps;

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ control, sx, onClose, ...props }, ref) => {
    const { timezone } = useTimezone();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [naturalLanguageInput, setNaturalLanguageInput] =
      useState<string>("");
    const [parsedRRule, setParsedRRule] = useState<string | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setNaturalLanguageInput("");
      setParsedRRule(null);
      if (onClose) {
        onClose();
      }
    };
    const open = Boolean(anchorEl);

    const id = open ? "calendar-popover" : undefined;

    // Memoize date calculations
    const { nextWeek, comingWeekend } = useMemo(() => {
      const today = dayjs().startOf("day");
      const nextWeek = dayjs().add(7, "day");
      const comingWeekend =
        today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);
      return { nextWeek, comingWeekend };
    }, []);

    const formatDayOfWeek = (date: Dayjs | null) => {
      if (date === null) {
        return "Date";
      }
      const givenDate = dayjs(date).startOf("day");
      const yesterday = dayjs().subtract(1, "day").startOf("day");
      const today = dayjs().startOf("day");
      const tomorrow = dayjs().add(1, "day").startOf("day");
      const sevenDaysFromNow = dayjs().add(7, "day").startOf("day"); // End on Sun
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
        return dayjs(date).format("dddd");
      }
      return dayjs(date).format("MMMM D");
    };

    const debouncedSetParsedRRule = useMemo(
      () =>
        debounce((value: string) => {
          const parsedRRule = parseNaturalLanguage(value);
          setParsedRRule(parsedRRule);
        }, 300),
      [],
    );

    const handleNaturalLanguageInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const value = e.target.value;
      setNaturalLanguageInput(value);
      debouncedSetParsedRRule(value);
    };

    return (
      <Controller
        name="rrule"
        control={control}
        render={({ field: rruleField }) => {
          // Parse the due date directly (no memoization needed here since it's simple)
          const dueDate = rruleField.value
            ? parseRRuleToDate(rruleField.value, timezone)
            : null;

          return (
            <>
              <ButtonGroup
                size="small"
                {...props}
                sx={[
                  {
                    "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                      borderRight:
                        props.variant === "text" ? "none" : undefined, // Remove dividers for text variant
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
                      onClick={() => {
                        rruleField.onChange(null);
                      }}
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
                  <ListItem>
                    <TextField
                      placeholder="Type a date…"
                      value={naturalLanguageInput}
                      onChange={handleNaturalLanguageInputChange}
                      fullWidth
                    />
                  </ListItem>
                  {parsedRRule && (
                    <ParsedRRuleListItem
                      rrule={parsedRRule}
                      onRRuleChange={(newRRule) => {
                        rruleField.onChange(newRRule);
                        // Note: DatePicker stays open to allow further adjustments
                      }}
                    />
                  )}
                  <ListItem divider disablePadding />
                  <ListItem
                    disablePadding
                    secondaryAction={dayjs().format("ddd")}
                  >
                    <ListItemButton
                      onClick={() => {
                        const today = dayjs();
                        const rrule = updateRRuleWithDate(
                          rruleField.value || null,
                          today,
                          timezone,
                        );
                        rruleField.onChange(rrule);
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
                        const tomorrow = dayjs().add(1, "day");
                        const rrule = updateRRuleWithDate(
                          rruleField.value || null,
                          tomorrow,
                          timezone,
                        );
                        rruleField.onChange(rrule);
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
                        const rrule = updateRRuleWithDate(
                          rruleField.value || null,
                          comingWeekend,
                          timezone,
                        );
                        rruleField.onChange(rrule);
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
                    secondaryAction={nextWeek.format("ddd")}
                  >
                    <ListItemButton
                      onClick={() => {
                        const rrule = updateRRuleWithDate(
                          rruleField.value || null,
                          nextWeek,
                          timezone,
                        );
                        rruleField.onChange(rrule);
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
                          rruleField.onChange(null);
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
                        onChange={(newDate: Dayjs | null) => {
                          if (newDate) {
                            const rrule = updateRRuleWithDate(
                              rruleField.value || null,
                              newDate,
                              timezone,
                            );
                            rruleField.onChange(rrule);
                          } else {
                            rruleField.onChange(null);
                          }
                          // Note: Dialog stays open to allow further adjustments
                        }}
                      />
                    </LocalizationProvider>
                  </ListItem>
                  <TimeOptionListItem
                    currentRRule={rruleField.value}
                    onRRuleChange={rruleField.onChange}
                  />
                  <RepeatOptionListItem
                    currentRRule={rruleField.value}
                    onRRuleChange={rruleField.onChange}
                  />
                </List>
              </Popover>
            </>
          );
        }}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
