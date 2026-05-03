import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Frequency, Options, RRule } from "rrule";

import { AnchorMode, EndType } from "../../../api/migration-helpers";
import useTimezoneContext from "../hooks/useTimezoneContext";
import { dayjsToRRuleDay } from "../utils";

interface RepeatOptionsCustomProps {
  open: boolean;
  onClose: () => void;
  onSave: (rrule: string, anchor_mode: AnchorMode | null) => void;
  dtstart: Dayjs | null;
  rrule: string | null;
  anchor_mode: AnchorMode | null;
}

interface RepeatFormData {
  frequency: Frequency;
  interval: number;
  endType: EndType;
  endDate: Dayjs | null;
  anchor_mode: AnchorMode;
  selectedDays: number[];
  monthlyOption: "day" | "weekday";
  // dayOfMonth: number;
  weekOfMonth: number;
  dayOfWeek: number;
  yearlyOption: "date" | "weekday";
  month: number;
  yearlyDayOfMonth: number;
  yearlyWeekOfMonth: number;
  yearlyDayOfWeek: number;
}

export default function RepeatOptionsCustom({
  open,
  onClose,
  onSave,
  rrule,
  dtstart,
  anchor_mode,
}: RepeatOptionsCustomProps) {
  const timezone = useTimezoneContext();
  const form = useForm<RepeatFormData>();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const watchedFrequency = watch("frequency");
  const watchedEndType = watch("endType");
  const defaultSelectedWeekday = dtstart
    ? dayjsToRRuleDay(dayjs.tz(dtstart, timezone))
    : dayjsToRRuleDay(dayjs.tz(dayjs(), timezone));

  const defaultDayOfMonth = dtstart
    ? dayjs.tz(dtstart, timezone).date()
    : dayjs.tz(dayjs(), timezone).date();

  const defaultMonth = dtstart
    ? dayjs.tz(dtstart, timezone).month() + 1
    : dayjs.tz(dayjs(), timezone).month() + 1;

  useEffect(() => {
    const rruleObject = rrule
      ? RRule.fromString(rrule)
      : RRule.fromString("FREQ=DAILY");

    const getMonthlyOption = (options: Options) => {
      if (options.byweekday && options.bysetpos) {
        return "weekday";
      }
      if (options.bymonthday) {
        return "day";
      }
      return "day";
    };

    const getYearlyOption = (options: Options) => {
      if (options.byweekday && options.bysetpos) {
        return "weekday";
      }
      if (options.bymonthday) {
        return "date";
      }
      return "date";
    };

    reset({
      frequency: rruleObject.options.freq,
      interval: rruleObject.options.interval,
      endType: rruleObject.options.until ? "ON_DATE" : "NEVER",
      endDate: rruleObject.options.until
        ? dayjs.utc(rruleObject.options.until).tz(timezone)
        : null,
      anchor_mode: anchor_mode || "SCHEDULED",
      selectedDays: rruleObject.options.byweekday || [defaultSelectedWeekday],
      monthlyOption: getMonthlyOption(rruleObject.options),
      // dayOfMonth: rruleObject.options.bymonthday?.[0] || defaultDayOfMonth,
      weekOfMonth: rruleObject.options.bysetpos?.[0] || undefined,
      dayOfWeek: rruleObject.options.byweekday
        ? rruleObject.options.byweekday[0]
        : dtstart
          ? dayjsToRRuleDay(dayjs.tz(dtstart, timezone))
          : dayjsToRRuleDay(dayjs.tz(dayjs(), timezone)),
      yearlyOption: getYearlyOption(rruleObject.options),
      month: rruleObject.options.bymonth?.[0] || defaultMonth,
      yearlyDayOfMonth:
        rruleObject.options.bymonthday?.[0] || defaultDayOfMonth,
      yearlyWeekOfMonth: rruleObject.options.bysetpos?.[0] || undefined,
      yearlyDayOfWeek: rruleObject.options.byweekday
        ? rruleObject.options.byweekday[0]
        : dtstart
          ? dayjsToRRuleDay(dayjs.tz(dtstart, timezone))
          : dayjsToRRuleDay(dayjs.tz(dayjs(), timezone)),
    });
  }, [
    rrule,
    timezone,
    dtstart,
    reset,
    anchor_mode,
    defaultSelectedWeekday,
    defaultDayOfMonth,
    defaultMonth,
  ]);

  const onSubmit = (data: RepeatFormData) => {
    const rruleOptions: Partial<Options> = {
      freq: data.frequency,
      interval: data.interval,
      until: data.endType === "ON_DATE" ? data.endDate?.toDate() || null : null,
    };

    // Handle frequency-specific options
    switch (data.frequency) {
      case Frequency.WEEKLY:
        if (data.selectedDays.length > 0) {
          rruleOptions.byweekday = data.selectedDays;
        }
        break;

      case Frequency.MONTHLY:
        if (data.monthlyOption === "day") {
          // Use current date values for monthly date option
          const currentDate = dtstart || dayjs();
          rruleOptions.bymonthday = currentDate.date();
        } else {
          // Use current date values for monthly weekday option
          const currentDate = dtstart || dayjs();
          rruleOptions.byweekday = currentDate.day();
          rruleOptions.bysetpos = Math.ceil(currentDate.date() / 7);
        }
        break;

      case Frequency.YEARLY:
        if (data.yearlyOption === "date") {
          // Use current date values for yearly date option
          const currentDate = dtstart || dayjs();
          rruleOptions.bymonth = currentDate.month() + 1;
          rruleOptions.bymonthday = currentDate.date();
        } else {
          // Use current date values for yearly weekday option
          const currentDate = dtstart || dayjs();
          rruleOptions.bymonth = currentDate.month() + 1;
          rruleOptions.byweekday = currentDate.day();
          rruleOptions.bysetpos = Math.ceil(currentDate.date() / 7);
        }
        break;

      case Frequency.DAILY:
      default:
        // No additional options needed for daily
        break;
    }

    const newRrule = new RRule(rruleOptions);
    onSave(newRrule.toString(), data.anchor_mode);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleDayToggle = (day: number, currentDays: number[]) => {
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setValue("selectedDays", newDays);
  };

  const getFullDayName = (day: number) => {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][day];
  };

  const getMonthlyDayLabel = () => {
    const currentDate = dtstart || dayjs.tz(dayjs(), timezone);
    const day = currentDate.date();
    const suffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
    return `The ${day}${suffix}`;
  };

  const getMonthlyWeekdayLabel = () => {
    const currentDate = dtstart || dayjs.tz(dayjs(), timezone);
    const weekNumber = Math.ceil(currentDate.date() / 7);
    const suffix =
      weekNumber === 1
        ? "st"
        : weekNumber === 2
          ? "nd"
          : weekNumber === 3
            ? "rd"
            : "th";
    const dayName = getFullDayName(currentDate.day());
    return `The ${weekNumber}${suffix} ${dayName}`;
  };

  const renderOnSection = () => {
    switch (watchedFrequency) {
      case Frequency.DAILY:
        return null; // No "On" section for daily

      case Frequency.WEEKLY:
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <Controller
              key="selectedDays"
              name="selectedDays"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {[
                    RRule.SU,
                    RRule.MO,
                    RRule.TU,
                    RRule.WE,
                    RRule.TH,
                    RRule.FR,
                    RRule.SA,
                  ].map((day) => {
                    return (
                      <FormControlLabel
                        key={day.toString()}
                        control={
                          <Checkbox
                            checked={field.value.includes(day.weekday)}
                            onChange={() =>
                              handleDayToggle(day.weekday, field.value)
                            }
                          />
                        }
                        label={day.toString()}
                        sx={{ margin: 0 }}
                      />
                    );
                  })}
                </Box>
              )}
            />
          </FormControl>
        );

      case Frequency.MONTHLY:
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <Controller
              key="monthlyOption"
              name="monthlyOption"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(e.target.value as "day" | "weekday")
                  }
                >
                  <FormControlLabel
                    value="day"
                    control={<Radio />}
                    label={getMonthlyDayLabel()}
                  />
                  <FormControlLabel
                    value="weekday"
                    control={<Radio />}
                    label={getMonthlyWeekdayLabel()}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        );

      case Frequency.YEARLY:
        return (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">On</FormLabel>
            <Controller
              key="yearlyOption"
              name="yearlyOption"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(e.target.value as "date" | "weekday")
                  }
                >
                  <FormControlLabel
                    value="date"
                    control={<Radio />}
                    label={`${dtstart ? dayjs(dtstart).date() : dayjs().date()}${dtstart ? (dayjs(dtstart).date() === 1 ? "st" : dayjs(dtstart).date() === 2 ? "nd" : dayjs(dtstart).date() === 3 ? "rd" : "th") : dayjs().date() === 1 ? "st" : dayjs().date() === 2 ? "nd" : dayjs().date() === 3 ? "rd" : "th"} ${dtstart ? dayjs(dtstart).format("MMMM") : dayjs().format("MMMM")}`}
                  />
                  <FormControlLabel
                    value="weekday"
                    control={<Radio />}
                    label={`The ${dtstart ? Math.ceil(dayjs(dtstart).date() / 7) : Math.ceil(dayjs().date() / 7)}${dtstart ? (Math.ceil(dayjs(dtstart).date() / 7) === 1 ? "st" : Math.ceil(dayjs(dtstart).date() / 7) === 2 ? "nd" : Math.ceil(dayjs(dtstart).date() / 7) === 3 ? "rd" : "th") : Math.ceil(dayjs().date() / 7) === 1 ? "st" : Math.ceil(dayjs().date() / 7) === 2 ? "nd" : Math.ceil(dayjs().date() / 7) === 3 ? "rd" : "th"} ${dtstart ? getFullDayName(dayjs(dtstart).day()) : getFullDayName(dayjs().day())} of ${dtstart ? dayjs(dtstart).format("MMMM") : dayjs().format("MMMM")}`}
                  />
                </RadioGroup>
              )}
            />
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
          <IconButton
            onClick={handleClose}
            size="small"
            role="button"
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            {/* Anchor */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Based on</FormLabel>
              <Controller
                name="anchor_mode"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value as AnchorMode)
                    }
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
                )}
              />
            </FormControl>

            {/* Every */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Every</FormLabel>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Controller
                  name="interval"
                  control={control}
                  rules={{ min: 1, max: 999 }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(String(e.target.value)) || 1)
                      }
                      inputProps={{ min: 1, max: 999 }}
                      sx={{ width: 80 }}
                      error={!!errors.interval}
                      helperText={errors.interval?.message}
                    />
                  )}
                />
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value as Frequency)
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value={Frequency.DAILY}>
                        {watch("interval") === 1 ? "Day" : "Days"}
                      </MenuItem>
                      <MenuItem value={Frequency.WEEKLY}>
                        {watch("interval") === 1 ? "Week" : "Weeks"}
                      </MenuItem>
                      <MenuItem value={Frequency.MONTHLY}>
                        {watch("interval") === 1 ? "Month" : "Months"}
                      </MenuItem>
                      <MenuItem value={Frequency.YEARLY}>
                        {watch("interval") === 1 ? "Year" : "Years"}
                      </MenuItem>
                    </Select>
                  )}
                />
              </Box>
            </FormControl>

            {/* On - Dynamic based on frequency */}
            {renderOnSection()}

            {/* Ends */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Ends</FormLabel>
              <Controller
                name="endType"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value as EndType)}
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
                )}
              />
              {watchedEndType === "ON_DATE" && (
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: "End date is required when 'On date' is selected",
                    validate: (value) => {
                      if (!value) return "End date is required";
                      if (value.isBefore(dayjs(), "day")) {
                        return "End date must be in the future";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        sx={{ mt: 1 }}
                        // timezone={timezone}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.endDate,
                            helperText: errors.endDate?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              )}
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} role="button" aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          role="button"
          aria-label="Save"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
