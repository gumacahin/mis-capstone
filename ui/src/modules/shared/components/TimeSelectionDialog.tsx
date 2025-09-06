import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useTimezone } from "../hooks/useTimezone";
import { parseTimeFromRRule } from "../utils/rrule";

interface TimeSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (time: Dayjs | null) => void;
  currentRRule?: string | null;
}

export default function TimeSelectionDialog({
  open,
  onClose,
  onSave,
  currentRRule,
}: TimeSelectionDialogProps) {
  const { timezone } = useTimezone();
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(() => {
    // Parse current time from RRule if available
    return currentRRule ? parseTimeFromRRule(currentRRule, timezone) : null;
  });
  // Memoize original time to avoid expensive parsing on every render
  const originalTime = useMemo(() => {
    return currentRRule ? parseTimeFromRRule(currentRRule, timezone) : null;
  }, [currentRRule, timezone]);

  const [inputValue, setInputValue] = useState<string>(() => {
    // Initialize input value with current time if available
    return originalTime ? originalTime.format("h:mm A") : "";
  });

  // Update state when currentRRule changes (e.g., when time is cleared)
  useEffect(() => {
    const newTime = currentRRule
      ? parseTimeFromRRule(currentRRule, timezone)
      : null;
    setSelectedTime(newTime);
    setInputValue(newTime ? newTime.format("h:mm A") : "");
  }, [currentRRule, timezone]);

  // Generate time options in 15-minute intervals (memoized and optimized)
  const timeOptions = useMemo(() => {
    const options: { label: string; value: Dayjs }[] = [];
    const startOfDay = dayjs().tz(timezone).startOf("day");

    // Pre-allocate array size for better performance
    options.length = 96; // 24 hours × 4 intervals per hour

    let index = 0;
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = startOfDay.hour(hour).minute(minute).second(0);
        options[index] = {
          label: time.format("h:mm A"),
          value: time,
        };
        index++;
      }
    }
    return options;
  }, [timezone]);

  const handleSave = () => {
    onSave(selectedTime);
    onClose();
  };

  const handleCancel = useCallback(() => {
    // Reset to original time (using memoized value)
    setSelectedTime(originalTime);
    setInputValue(originalTime ? originalTime.format("h:mm A") : "");
    onClose();
  }, [originalTime, onClose]);

  const handleTimeChange = useCallback(
    (
      _event: React.SyntheticEvent,
      newValue: string | { label: string; value: Dayjs } | null,
    ) => {
      if (typeof newValue === "object" && newValue !== null) {
        setSelectedTime(newValue.value);
      } else {
        setSelectedTime(null);
      }
    },
    [],
  );

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      // Update input value to allow free typing
      setInputValue(newInputValue);

      // Only parse if the input looks like a complete time (has colon and at least 4 characters)
      if (newInputValue.length >= 4 && newInputValue.includes(":")) {
        // Improved regex to handle malformed input like "3:30 AM PM"
        // Look for the last occurrence of AM/PM in the string
        const timeMatch = newInputValue.match(
          /^(\d{1,2}):(\d{2})\s*(?:AM|PM|am|pm)?\s*(?:AM|PM|am|pm)?\s*(AM|PM|am|pm)?$/i,
        );

        // If the above regex doesn't work, try a simpler approach
        // Extract the last AM/PM from the string
        let period = undefined;
        const periodMatch = newInputValue.match(/(AM|PM|am|pm)\s*$/i);
        if (periodMatch) {
          period = periodMatch[1].toUpperCase();
        }
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          const minute = parseInt(timeMatch[2]);
          // Use the extracted period from the end of the string
          const finalPeriod = period || timeMatch[3]?.toUpperCase();

          if (finalPeriod === "PM" && hour !== 12) {
            hour += 12;
          } else if (finalPeriod === "AM" && hour === 12) {
            hour = 0;
          }

          if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
            const time = dayjs()
              .tz(timezone)
              .startOf("day")
              .hour(hour)
              .minute(minute)
              .second(0);
            setSelectedTime(time);
          }
        }
      }
    },
    [timezone],
  );

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Set Time</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={timeOptions}
          value={
            selectedTime
              ? timeOptions.find((option) =>
                  option.value.isSame(selectedTime, "minute"),
                ) || undefined
              : undefined
          }
          inputValue={inputValue}
          onChange={handleTimeChange}
          onInputChange={handleInputChange}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          isOptionEqualToValue={(option, value) =>
            typeof option === "string" || typeof value === "string"
              ? option === value
              : option.value.isSame(value.value, "minute")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Time"
              fullWidth
              margin="normal"
              placeholder="Type or select time (e.g., 5:15 AM)"
            />
          )}
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
