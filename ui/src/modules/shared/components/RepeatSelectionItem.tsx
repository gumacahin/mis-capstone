import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import RepeatIcon from "@mui/icons-material/Repeat";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";

interface RepeatSelectionItemProps {
  value: string | null;
  onChange: (repeat: string | null) => void;
  disabled?: boolean;
  selectedDate?: Dayjs | null;
  anchorMode?: "SCHEDULED" | "COMPLETED";
  onAnchorModeChange?: (mode: "SCHEDULED" | "COMPLETED") => void;
}

const RepeatSelectionItem: React.FC<RepeatSelectionItemProps> = ({
  value,
  onChange,
  disabled = false,
  selectedDate = null,
  anchorMode = "SCHEDULED",
  onAnchorModeChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  // Custom dialog form state
  const [basedOn, setBasedOn] = useState<"scheduled" | "completed">(
    anchorMode === "SCHEDULED" ? "scheduled" : "completed",
  );
  const [interval, setInterval] = useState(1);
  const [frequency, setFrequency] = useState<"day" | "week" | "month" | "year">(
    "day",
  );

  const [endsType, setEndsType] = useState<"never" | "onDate">("never");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  // Dynamic form state based on frequency
  const [selectedWeekday, setSelectedWeekday] = useState("mon");
  const [monthOption, setMonthOption] = useState<"day" | "weekday">("day");
  const [yearOption, setYearOption] = useState<"date" | "weekday">("date");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleRecurrenceSelect = (recurrence: string | null) => {
    onChange(recurrence);
    handleClose();
  };

  const getDisplayText = () => {
    if (!value) return "Repeat";

    // Parse the recurrence value to generate the proper display text
    if (value === "custom") return "Custom";

    if (value === "every day") return "Every day";
    if (value === "every weekday") return "Every weekday";

    // Handle "every monday", "every tuesday", etc.
    if (value.startsWith("every ") && value.length > 6) {
      const day = value.substring(6); // Remove "every "
      if (
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].includes(day)
      ) {
        return `Every ${day.charAt(0).toUpperCase() + day.slice(1, 3)}`; // First 3 letters
      }
    }

    // Handle "every 15th", "every 3rd", etc.
    if (value.match(/^every \d+[st|nd|rd|th]$/)) {
      const day = value.substring(6); // Remove "every "
      return `Every ${day}`;
    }

    // Handle "every year on august 15"
    if (value.match(/^every year on [a-z]+ \d+$/)) {
      const parts = value.split(" ");
      const month = parts[3]; // "august"
      const day = parts[4]; // "15"
      const monthShort = month.charAt(0).toUpperCase() + month.slice(1, 3); // "Aug"
      return `Every ${day} ${monthShort}`;
    }

    return value;
  };

  const getDynamicOptions = () => {
    const date = selectedDate || dayjs();
    const dayOfMonth = date.date();
    const monthName = date.format("MMMM");

    return [
      { label: "Every day", value: "every day" },
      {
        label: `Every week on ${date.format("dddd")}`,
        value: `every ${date.format("dddd").toLowerCase()}`,
      },
      { label: "Every weekday (Mon - Fri)", value: "every weekday" },
      {
        label: `Every month on the ${dayOfMonth}${getOrdinalSuffix(
          dayOfMonth,
        )}`,
        value: `every ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`,
      },
      {
        label: `Every year on ${monthName} ${dayOfMonth}${getOrdinalSuffix(
          dayOfMonth,
        )}`,
        value: `every year on ${monthName.toLowerCase()} ${dayOfMonth}`,
      },
      { label: "Custom...", value: "custom" },
    ];
  };

  // Helper to get a valid date for display (either selectedDate or today)
  const getDisplayDate = () => {
    return selectedDate && selectedDate.isValid() ? selectedDate : dayjs();
  };

  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const getOrdinalPosition = (date: Dayjs | null) => {
    if (!date) return "1st";
    const dayOfMonth = date.date();
    if (dayOfMonth <= 7) return "1st";
    if (dayOfMonth <= 14) return "2nd";
    if (dayOfMonth <= 21) return "3rd";
    if (dayOfMonth <= 28) return "4th";
    return "5th";
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          component="button"
          disabled={disabled}
        >
          <ListItemIcon>
            <RepeatIcon />
          </ListItemIcon>
          <ListItemText
            primary={getDisplayText()}
            primaryTypographyProps={{
              color: value ? "text.primary" : "text.secondary",
              fontWeight: value ? 500 : 400,
            }}
          />
          {value && (
            <Tooltip title="Clear repeat">
              <Button
                size="small"
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                sx={{
                  minWidth: "auto",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </Tooltip>
          )}
        </ListItemButton>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        {getDynamicOptions().map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              if (option.value === "custom") {
                setCustomDialogOpen(true);
                handleClose();
              } else {
                handleRecurrenceSelect(option.value);
              }
            }}
            sx={{
              py: 1.5,
              px: 2,
            }}
          >
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Custom Repeat Dialog */}
      <Dialog
        open={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Custom Repeat</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Based on section */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Based on
              </Typography>
              <RadioGroup
                value={basedOn}
                onChange={(e) => {
                  const newMode = e.target.value as "scheduled" | "completed";
                  setBasedOn(newMode);
                  // Update external anchor mode if callback provided
                  if (onAnchorModeChange) {
                    onAnchorModeChange(
                      newMode === "scheduled" ? "SCHEDULED" : "COMPLETED",
                    );
                  }
                }}
              >
                <FormControlLabel
                  value="scheduled"
                  control={<Radio />}
                  label="Scheduled date"
                />
                <FormControlLabel
                  value="completed"
                  control={<Radio />}
                  label="Completed date"
                />
              </RadioGroup>
            </FormControl>

            {/* Every section */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Every
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Stack spacing={-1} marginRight={"-10px"}>
                            <IconButton
                              size="small"
                              onClick={() => setInterval(interval + 1)}
                            >
                              <ArrowDropUpIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setInterval(interval > 1 ? interval - 1 : 1)
                              }
                            >
                              <ArrowDropDownIcon />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ width: 100 }}
                />
                <Select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(
                      e.target.value as "day" | "week" | "month" | "year",
                    )
                  }
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="day">{`Day${interval > 1 ? `s` : ""}`}</MenuItem>
                  <MenuItem value="week">{`Week${interval > 1 ? `s` : ""}`}</MenuItem>
                  <MenuItem value="month">{`Month${interval > 1 ? `s` : ""}`}</MenuItem>
                  <MenuItem value="year">{`Year${interval > 1 ? `s` : ""}`}</MenuItem>
                </Select>
              </Stack>
            </FormControl>

            {/* On section - dynamically changes based on frequency */}
            {frequency === "week" && interval === 1 && (
              <FormControl component="fieldset">
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  On
                </Typography>
                <RadioGroup
                  value={selectedWeekday || "mon"}
                  onChange={(e) => setSelectedWeekday(e.target.value)}
                >
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {[
                      { value: "mon", label: "Mon" },
                      { value: "tue", label: "Tue" },
                      { value: "wed", label: "Wed" },
                      { value: "thu", label: "Thu" },
                      { value: "fri", label: "Fri" },
                      { value: "sat", label: "Sat" },
                      { value: "sun", label: "Sun" },
                    ].map((day) => (
                      <FormControlLabel
                        key={day.value}
                        value={day.value}
                        control={<Radio />}
                        label={day.label}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            )}

            {frequency === "month" && interval === 1 && (
              <FormControl component="fieldset">
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  On
                </Typography>
                <RadioGroup
                  value={monthOption || "day"}
                  onChange={(e) =>
                    setMonthOption(e.target.value as "day" | "weekday")
                  }
                >
                  <FormControlLabel
                    value="day"
                    control={<Radio />}
                    label={`The ${getDisplayDate().date()}${getOrdinalSuffix(getDisplayDate().date())}`}
                  />
                  <FormControlLabel
                    value="weekday"
                    control={<Radio />}
                    label={`The ${getOrdinalPosition(getDisplayDate())} ${getDisplayDate().format("dddd")}`}
                  />
                </RadioGroup>
              </FormControl>
            )}

            {frequency === "year" && (
              <FormControl component="fieldset">
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  On
                </Typography>
                <RadioGroup
                  value={yearOption || "date"}
                  onChange={(e) =>
                    setYearOption(e.target.value as "date" | "weekday")
                  }
                >
                  <FormControlLabel
                    value="date"
                    control={<Radio />}
                    label={`${getDisplayDate().date()}${getOrdinalSuffix(getDisplayDate().date())} ${getDisplayDate().format("MMMM")}`}
                  />
                  <FormControlLabel
                    value="weekday"
                    control={<Radio />}
                    label={`The ${getOrdinalPosition(getDisplayDate())} ${getDisplayDate().format("dddd")} of ${getDisplayDate().format("MMMM")}`}
                  />
                </RadioGroup>
              </FormControl>
            )}

            {/* Ends section */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Ends
              </Typography>
              <RadioGroup
                value={endsType}
                onChange={(e) =>
                  setEndsType(e.target.value as "never" | "onDate")
                }
              >
                <FormControlLabel
                  value="never"
                  control={<Radio />}
                  label="Never"
                />
                <FormControlLabel
                  value="onDate"
                  control={<Radio />}
                  label="On date"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              // Generate recurrence string from form values
              let recurrenceString = "";

              if (interval > 1) {
                recurrenceString += `every ${interval} ${frequency}`;
              } else {
                recurrenceString += `every ${frequency}`;
              }

              // Add specific options based on frequency
              if (frequency === "week" && selectedWeekday) {
                const dayNames = {
                  mon: "monday",
                  tue: "tuesday",
                  wed: "wednesday",
                  thu: "thursday",
                  fri: "friday",
                  sat: "saturday",
                  sun: "sunday",
                };
                recurrenceString += ` on ${dayNames[selectedWeekday as keyof typeof dayNames]}`;
              }

              if (frequency === "month") {
                if (monthOption === "day") {
                  const day = selectedDate?.date() || 1;
                  recurrenceString += ` on the ${day}${getOrdinalSuffix(day)}`;
                } else {
                  const position = getOrdinalPosition(selectedDate);
                  const dayName =
                    selectedDate?.format("dddd").toLowerCase() || "monday";
                  recurrenceString += ` on the ${position} ${dayName}`;
                }
              }

              if (frequency === "year") {
                if (yearOption === "date") {
                  const day = selectedDate?.date() || 1;
                  const month =
                    selectedDate?.format("MMMM").toLowerCase() || "january";
                  recurrenceString += ` on ${day}${getOrdinalSuffix(day)} ${month}`;
                } else {
                  const position = getOrdinalPosition(selectedDate);
                  const dayName =
                    selectedDate?.format("dddd").toLowerCase() || "monday";
                  const month =
                    selectedDate?.format("MMMM").toLowerCase() || "january";
                  recurrenceString += ` on the ${position} ${dayName} of ${month}`;
                }
              }

              if (endsType === "onDate" && endDate) {
                recurrenceString += ` until ${endDate.format("MMM D, YYYY")}`;
              }

              if (recurrenceString.trim()) {
                onChange(recurrenceString.trim());
                setCustomDialogOpen(false);
                // Reset form
                setBasedOn("scheduled");
                setInterval(1);
                setFrequency("year");
                setEndsType("never");
                setEndDate(null);
                setSelectedWeekday("mon");
                setMonthOption("day");
                setYearOption("date");
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RepeatSelectionItem;
