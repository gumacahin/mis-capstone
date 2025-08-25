import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

interface TimePickerProps {
  value: Dayjs | null;
  onChange: (time: Dayjs | null) => void;
  onCancel: () => void;
  use24Hour?: boolean; // Allow explicit control over 12/24 hour format
  currentDate?: Dayjs | null; // Current date context for smart date assignment
}

export default function TimePicker({
  value,
  onChange,
  onCancel,
  use24Hour = false, // Default to 12-hour format
  currentDate = null, // Current date context for smart date assignment
}: TimePickerProps) {
  const [tempTime, setTempTime] = useState<Dayjs | null>(value);
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  // Generate time options based on 12/24 hour preference
  const timeOptions = useMemo(() => {
    const options: string[] = [];

    if (use24Hour) {
      // 24-hour format: 00:00, 00:15, 00:30, 00:45, 01:00, etc.
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          options.push(timeStr);
        }
      }
    } else {
      // 12-hour format: 12:00 AM, 12:15 AM, 12:30 AM, 12:45 AM, 1:00 AM, etc.
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeStr = `${hour}:${minute.toString().padStart(2, "0")} ${hour === 12 ? "AM" : "AM"}`;
          options.push(timeStr);
        }
      }
      // Add PM times
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeStr = `${hour}:${minute.toString().padStart(2, "0")} ${hour === 12 ? "PM" : "PM"}`;
          options.push(timeStr);
        }
      }
    }

    return options;
  }, [use24Hour]);

  // Parse time input (supports both 12/24 hour formats)
  const parseTime = (input: string): Dayjs | null => {
    if (!input.trim()) return null;

    // Use a base date for parsing times
    const baseDate = dayjs("2024-01-01");

    // Normalize input: convert am/pm to AM/PM and ensure space before AM/PM
    const normalizedInput = input
      .replace(/(am|pm)/gi, (match) => " " + match.toUpperCase())
      .replace(/^\s+/, ""); // Remove leading space if it was added

    // Try 12-hour format with space before AM/PM (e.g., "2:30 PM", "12:45 AM")
    let time = baseDate.format("YYYY-MM-DD") + " " + normalizedInput;
    let parsedTime = dayjs(time);
    if (parsedTime.isValid()) return parsedTime;

    // Try 12-hour format without space before AM/PM (e.g., "2:30PM", "12:45AM")
    time = baseDate.format("YYYY-MM-DD") + " " + normalizedInput;
    parsedTime = dayjs(time);
    if (parsedTime.isValid()) return parsedTime;

    // Try 24-hour format (e.g., "14:30", "00:45")
    time = baseDate.format("YYYY-MM-DD") + " " + normalizedInput;
    parsedTime = dayjs(time);
    if (parsedTime.isValid()) return parsedTime;

    // Try 12-hour without AM/PM (assume current period)
    time = baseDate.format("YYYY-MM-DD") + " " + normalizedInput;
    parsedTime = dayjs(time);
    if (parsedTime.isValid()) {
      // Default to AM for early hours, PM for later hours
      const hour = parsedTime.hour();
      if (hour < 6) return parsedTime; // Early morning
      if (hour < 12) return parsedTime; // Morning
      return parsedTime.hour(hour + 12); // Afternoon/Evening
    }

    return null;
  };

  // Format time for display
  const formatTime = (time: Dayjs): string => {
    return use24Hour ? time.format("HH:mm") : time.format("h:mm A");
  };

  const handleTimeChange = (
    event: React.SyntheticEvent,
    newValue: string | null,
  ) => {
    if (newValue) {
      const parsedTime = parseTime(newValue);
      if (parsedTime) {
        setTempTime(parsedTime);
        setInputValue(formatTime(parsedTime));
        setIsValid(true);
      }
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    setInputValue(newInputValue);

    // Validate input as user types
    if (newInputValue.trim() === "") {
      setIsValid(true); // Empty input is valid (no time selected)
      setTempTime(null);
    } else {
      const parsedTime = parseTime(newInputValue);
      if (parsedTime) {
        setTempTime(parsedTime);
        setIsValid(true);
      } else {
        setIsValid(false);
        setTempTime(null);
      }
    }
  };

  const handleSave = () => {
    if (isValid && (tempTime !== null || inputValue.trim() === "")) {
      if (inputValue.trim() === "") {
        // Case 1: Empty time field - remove time from the datetime field
        if (value) {
          // Keep the date but set time to midnight (00:00)
          const dateOnly = value.startOf("day");
          onChange(dateOnly);
        } else {
          // No date, no time - pass null
          onChange(null);
        }
      } else if (tempTime && !currentDate) {
        // Case 2 & 3: No date selected, but time is selected
        const now = dayjs();
        const selectedTime = tempTime;

        // Create today's date with the selected time
        let targetDate = now
          .startOf("day")
          .hour(selectedTime.hour())
          .minute(selectedTime.minute())
          .second(0);

        // If the selected time is before current time, use today
        // If the selected time is after current time, use tomorrow
        if (selectedTime.isAfter(now, "minute")) {
          // Time is after current time, use today
          onChange(targetDate);
        } else {
          // Time is before or equal to current time, use tomorrow
          targetDate = targetDate.add(1, "day");
          onChange(targetDate);
        }
      } else if (tempTime && currentDate) {
        // Case: Date is already selected, just update the time
        const combined = currentDate
          .hour(tempTime.hour())
          .minute(tempTime.minute())
          .second(0);
        onChange(combined);
      } else {
        // Fallback: just pass the time as is
        onChange(tempTime);
      }
    }
  };

  const handleCancel = () => {
    setTempTime(value);
    setInputValue(value ? formatTime(value) : "");
    setIsValid(true);
    onCancel();
  };

  // Initialize input value when component mounts or value changes
  useState(() => {
    if (value) {
      setInputValue(formatTime(value));
      setIsValid(true);
    }
  });

  // Determine if save button should be enabled
  // Enable if input is valid AND either we have a valid time OR we're clearing the time (empty input)
  const canSave = isValid && (tempTime !== null || inputValue.trim() === "");

  return (
    <div style={{ padding: "16px", minWidth: "300px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={3}>
          <Typography variant="body1">Time</Typography>
        </Grid>
        <Grid size={9}>
          <Autocomplete
            freeSolo
            options={timeOptions}
            value={inputValue}
            onChange={handleTimeChange}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                placeholder="Enter time or select from dropdown"
                error={!isValid}
                helperText={!isValid ? "Please enter a valid time" : ""}
              />
            )}
            filterOptions={(options, { inputValue }) => {
              // Filter options based on input
              return options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase()),
              );
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!canSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
