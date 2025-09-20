import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { TaskFormFields } from "..";
import useTimezoneContext from "../hooks/useTimezoneContext";

interface TimeOptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface TimeOptionsDialogForm {
  time: string;
}

function TimeOptionsDialog({ open, onClose }: TimeOptionsDialogProps) {
  const { setValue, watch } = useFormContext<TaskFormFields>();
  const timezone = useTimezoneContext();

  const validateTime = (value: string) => {
    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timePattern.test(value.trim())) {
      return "Please enter a valid time (e.g., 2:30 PM)";
    }
    return true;
  };
  const form = useForm<TimeOptionsDialogForm>({
    defaultValues: { time: "" },
    mode: "onChange",
    resolver: (values) => {
      const errors: Record<string, { message: string }> = {};
      if (!validateTime(values.time)) {
        errors.time = { message: "Please enter a valid time (e.g., 2:30 PM)" };
      }
      return { values, errors };
    },
  });

  // Generate time options from 12:15 AM to 11:45 PM in 15-minute intervals
  const options = useMemo(() => {
    const opts: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        // Exclude 12:00 AM and 12:00 AM of the next day (i.e., 24:00)
        if (hour === 0 && min === 0) continue;
        if (hour === 23 && min > 45) break;
        const time = dayjs().hour(hour).minute(min).second(0).millisecond(0);
        // Format as h:mm AM/PM, remove leading zero from hour
        const formatted = time.format("h:mm A");
        opts.push(formatted);
      }
    }
    return opts;
  }, []);

  const dtstart = watch("dtstart");

  const onSave = (data: TimeOptionsDialogForm) => {
    const time = data.time || "12:00 AM";
    const effectiveDatetime = dtstart
      ? dayjs.tz(dtstart, timezone)
      : dayjs.tz(dayjs(), timezone).startOf("day");

    const parsedTime = dayjs(time, "h:mm A");
    const updatedDateTime = effectiveDatetime
      .hour(parsedTime.hour())
      .minute(parsedTime.minute())
      .second(0)
      .millisecond(0);
    setValue("dtstart", updatedDateTime);
    onClose();
  };

  useEffect(() => {
    const effectiveDatetime = dtstart
      ? dayjs.tz(dtstart, timezone)
      : dayjs.tz(dayjs(), timezone).startOf("day");
    form.reset({
      time: effectiveDatetime.format("h:mm A"),
    });
  }, [dtstart, form, timezone]);

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <form onSubmit={form.handleSubmit(onSave)}>
        <DialogTitle>Set Time</DialogTitle>
        <DialogContent>
          <Autocomplete
            sx={{ mt: 1 }}
            freeSolo
            value={form.watch("time")}
            onChange={(_, newInputValue) => {
              form.setValue("time", newInputValue || "", {
                shouldValidate: true,
              });
            }}
            onInputChange={(_, newInputValue, reason) => {
              const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
              if (
                reason === "input" &&
                newInputValue &&
                timePattern.test(newInputValue.trim())
              ) {
                form.setValue("time", newInputValue);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Type or select a time." />
            )}
            fullWidth
            options={options}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!form.formState.isValid}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function TimeOptions() {
  const timezone = useTimezoneContext();
  const [open, setOpen] = useState(false);
  const { watch, setValue } = useFormContext<TaskFormFields>();
  const dtstart = watch("dtstart");
  const hasTime =
    dtstart && dtstart.tz(timezone).format("h:mm A") !== "12:00 AM";

  const getPrimaryText = () => {
    if (hasTime) {
      return dtstart.tz(timezone).format("h:mm A");
    }
    return "Time";
  };
  const handleClear = (e: MouseEvent<HTMLElement>) => {
    if (!dtstart) return;
    e.stopPropagation();
    const newTime = dtstart.tz(timezone).startOf("day");
    setValue("dtstart", newTime);
  };

  return (
    <>
      <TimeOptionsDialog open={open} onClose={() => setOpen(false)} />
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(true)}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary={getPrimaryText()} />
          {hasTime && (
            <ListItemIcon
              onClick={handleClear}
              sx={{
                cursor: "pointer",
                "&:hover": { opacity: 0.7 },
                minWidth: "auto",
                marginLeft: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
    </>
  );
}
