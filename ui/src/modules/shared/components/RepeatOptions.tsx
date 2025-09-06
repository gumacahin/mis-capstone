import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useTimezone } from "../hooks/useTimezone";
import { generateCustomRRule } from "../utils/rrule";

interface RepeatOptionsProps {
  open: boolean;
  onClose: () => void;
  onSave: (rrule: string) => void;
  selectedDate: Dayjs | null;
  currentRRule?: string | null;
}

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
type EndType = "NEVER" | "ON_DATE";

export default function RepeatOptions({
  open,
  onClose,
  onSave,
  selectedDate,
  currentRRule: _currentRRule,
}: RepeatOptionsProps) {
  const { timezone } = useTimezone();

  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [interval, setInterval] = useState(1);
  const [endType, setEndType] = useState<EndType>("NEVER");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [basedOn, setBasedOn] = useState<"SCHEDULED" | "COMPLETED">(
    "SCHEDULED",
  );

  // State for "On" section
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [monthlyOption, setMonthlyOption] = useState<"day" | "weekday">("day");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [weekOfMonth, setWeekOfMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [yearlyOption, setYearlyOption] = useState<"date" | "weekday">("date");
  const [month, setMonth] = useState(1);
  const [yearlyDayOfMonth, setYearlyDayOfMonth] = useState(1);
  const [yearlyWeekOfMonth, setYearlyWeekOfMonth] = useState(1);
  const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState(0);

  const handleSave = () => {
    const rrule = generateCustomRRule(
      selectedDate,
      {
        frequency,
        interval,
        endType,
        endDate: endType === "ON_DATE" ? endDate : null,
        basedOn,
        selectedDays: frequency === "WEEKLY" ? selectedDays : undefined,
      },
      timezone,
      _currentRRule,
    );

    if (rrule) {
      onSave(rrule);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) => {
      const newDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      return newDays;
    });
  };

  const renderOnSection = () => {
    switch (frequency) {
      case "DAILY":
        return null; // No "On" section for daily

      case "WEEKLY":
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={selectedDays.includes(index)}
                        onChange={() => handleDayToggle(index)}
                      />
                    }
                    label={day}
                    sx={{ margin: 0 }}
                  />
                ),
              )}
            </Box>
          </FormControl>
        );

      case "MONTHLY":
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <RadioGroup
              value={monthlyOption}
              onChange={(e) => {
                const newOption = e.target.value as "day" | "weekday";
                setMonthlyOption(newOption);
              }}
            >
              <FormControlLabel
                value="day"
                control={<Radio />}
                label={`The ${dayOfMonth}${dayOfMonth === 1 ? "st" : dayOfMonth === 2 ? "nd" : dayOfMonth === 3 ? "rd" : "th"}`}
              />
              <FormControlLabel
                value="weekday"
                control={<Radio />}
                label={`The ${weekOfMonth}${weekOfMonth === 1 ? "st" : weekOfMonth === 2 ? "nd" : weekOfMonth === 3 ? "rd" : "th"} ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek]}`}
              />
            </RadioGroup>
            {monthlyOption === "day" && (
              <TextField
                type="number"
                value={dayOfMonth}
                onChange={(e) => {
                  const newDay = parseInt(e.target.value as string) || 1;
                  setDayOfMonth(newDay);
                }}
                inputProps={{ min: 1, max: 31 }}
                sx={{ mt: 1, width: 80 }}
              />
            )}
            {monthlyOption === "weekday" && (
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <TextField
                  type="number"
                  value={weekOfMonth}
                  onChange={(e) => {
                    const newWeek = parseInt(e.target.value as string) || 1;
                    // console.log("=== Week of Month Change ===");
                    // console.log("New week of month:", newWeek);
                    setWeekOfMonth(newWeek);
                  }}
                  inputProps={{ min: 1, max: 4 }}
                  sx={{ width: 60 }}
                />
                <Select
                  value={dayOfWeek}
                  onChange={(e) => {
                    const newDay = parseInt(e.target.value as string);
                    // console.log("=== Day of Week Change ===");
                    // console.log("New day of week:", newDay);
                    setDayOfWeek(newDay);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day, index) => (
                    <MenuItem key={day} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
          </FormControl>
        );

      case "YEARLY":
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <RadioGroup
              value={yearlyOption}
              onChange={(e) => {
                const newOption = e.target.value as "date" | "weekday";
                // console.log("=== Yearly Option Change ===");
                // console.log("New yearly option:", newOption);
                setYearlyOption(newOption);
              }}
            >
              <FormControlLabel
                value="date"
                control={<Radio />}
                label={`${yearlyDayOfMonth}${yearlyDayOfMonth === 1 ? "st" : yearlyDayOfMonth === 2 ? "nd" : yearlyDayOfMonth === 3 ? "rd" : "th"} ${dayjs()
                  .month(month - 1)
                  .format("MMMM")}`}
              />
              <FormControlLabel
                value="weekday"
                control={<Radio />}
                label={`The ${yearlyWeekOfMonth}${yearlyWeekOfMonth === 1 ? "st" : yearlyWeekOfMonth === 2 ? "nd" : yearlyWeekOfMonth === 3 ? "rd" : "th"} ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][yearlyDayOfWeek]} of ${dayjs()
                  .month(month - 1)
                  .format("MMMM")}`}
              />
            </RadioGroup>
            {yearlyOption === "date" && (
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <TextField
                  type="number"
                  value={yearlyDayOfMonth}
                  onChange={(e) => {
                    const newDay = parseInt(e.target.value as string) || 1;
                    // console.log("=== Yearly Day of Month Change ===");
                    // console.log("New yearly day of month:", newDay);
                    setYearlyDayOfMonth(newDay);
                  }}
                  inputProps={{ min: 1, max: 31 }}
                  sx={{ width: 60 }}
                />
                <Select
                  value={month}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value as string);
                    // console.log("=== Month Change (Yearly Date) ===");
                    // console.log("New month:", newMonth);
                    setMonth(newMonth);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {dayjs().month(i).format("MMMM")}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
            {yearlyOption === "weekday" && (
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <TextField
                  type="number"
                  value={yearlyWeekOfMonth}
                  onChange={(e) => {
                    const newWeek = parseInt(e.target.value as string) || 1;
                    // console.log("=== Yearly Week of Month Change ===");
                    // console.log("New yearly week of month:", newWeek);
                    setYearlyWeekOfMonth(newWeek);
                  }}
                  inputProps={{ min: 1, max: 4 }}
                  sx={{ width: 60 }}
                />
                <Select
                  value={yearlyDayOfWeek}
                  onChange={(e) => {
                    const newDay = parseInt(e.target.value as string);
                    // console.log("=== Yearly Day of Week Change ===");
                    // console.log("New yearly day of week:", newDay);
                    setYearlyDayOfWeek(newDay);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day, index) => (
                    <MenuItem key={day} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={month}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value as string);
                    // console.log("=== Month Change (Yearly Weekday) ===");
                    // console.log("New month:", newMonth);
                    setMonth(newMonth);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {dayjs().month(i).format("MMMM")}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Custom repeat
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack>
          {/* Based on */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Based on</FormLabel>
            <RadioGroup
              value={basedOn}
              onChange={(e) => {
                const newBasedOn = e.target.value as "SCHEDULED" | "COMPLETED";
                // console.log("=== Based On Change ===");
                // console.log("New based on:", newBasedOn);
                setBasedOn(newBasedOn);
              }}
            >
              <FormControlLabel
                value="SCHEDULED"
                control={<Radio />}
                label="Scheduled date"
              />
              <FormControlLabel
                value="COMPLETED"
                control={<Radio />}
                label="Completed date"
              />
            </RadioGroup>
          </FormControl>

          {/* Every */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Every</FormLabel>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                type="number"
                value={interval}
                onChange={(e) => {
                  const newInterval = parseInt(e.target.value as string) || 1;
                  // console.log("=== Interval Change ===");
                  // console.log("New interval:", newInterval);
                  setInterval(newInterval);
                }}
                inputProps={{ min: 1, max: 999 }}
                sx={{ width: 80 }}
              />
              <Select
                value={frequency}
                onChange={(e) => {
                  const newFrequency = e.target.value as Frequency;
                  // console.log("=== Frequency Change ===");
                  // console.log("New frequency:", newFrequency);
                  setFrequency(newFrequency);
                }}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="DAILY">
                  {interval === 1 ? "Day" : "Days"}
                </MenuItem>
                <MenuItem value="WEEKLY">
                  {interval === 1 ? "Week" : "Weeks"}
                </MenuItem>
                <MenuItem value="MONTHLY">
                  {interval === 1 ? "Month" : "Months"}
                </MenuItem>
                <MenuItem value="YEARLY">
                  {interval === 1 ? "Year" : "Years"}
                </MenuItem>
              </Select>
            </Box>
          </FormControl>

          {/* On - Dynamic based on frequency */}
          {renderOnSection()}

          {/* Ends */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Ends</FormLabel>
            <RadioGroup
              value={endType}
              onChange={(e) => {
                const newEndType = e.target.value as EndType;
                // console.log("=== End Type Change ===");
                // console.log("New end type:", newEndType);
                setEndType(newEndType);
              }}
            >
              <FormControlLabel
                value="NEVER"
                control={<Radio />}
                label="Never"
              />
              <FormControlLabel
                value="ON_DATE"
                control={<Radio />}
                label="On date"
              />
            </RadioGroup>
            {endType === "ON_DATE" && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => {
                    // console.log("=== End Date Change ===");
                    // console.log(
                    //   "New end date:",
                    //   newValue?.format("YYYY-MM-DD dddd"),
                    // );
                    setEndDate(newValue);
                  }}
                  sx={{ mt: 1 }}
                  timezone={timezone}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
