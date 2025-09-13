import CloseIcon from "@mui/icons-material/Close";
import RepeatIcon from "@mui/icons-material/Repeat";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MouseEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RRule } from "rrule";

import useTimezoneContext from "../hooks/useTimezoneContext";
import { generateRrule } from "../rrule";
import { AnchorMode, RepeatOption, TaskFormFields } from "../types/common";
import RepeatOptionsCustom from "./RepeatOptionsCustom";

dayjs.extend(utc);

export default function RepeatOptions() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const { watch, setValue } = useFormContext<TaskFormFields>();
  const timezone = useTimezoneContext();
  const dtstartLocal = watch("dtstart_local");
  const startDate = dtstartLocal
    ? dayjs.tz(dtstartLocal, timezone).startOf("day")
    : dayjs.tz(dayjs(), timezone).startOf("day");
  const rrule = watch("rrule");
  const anchor_mode = watch("anchor_mode");
  const isRepeating = rrule !== null;

  const quickOptions: { key: RepeatOption | "custom"; label: string }[] = [
    { key: "daily", label: "Every day" },
    {
      key: "weekly",
      label: `Every week on ${startDate.format("dddd")}`,
    },
    { key: "weekdays", label: "Every weekday (Mon-Fri)" },
    {
      key: "monthly",
      label: `Every month on the ${startDate.date()}${startDate.date() === 1 ? "st" : startDate.date() === 2 ? "nd" : startDate.date() === 3 ? "rd" : "th"}`,
    },
    { key: "yearly", label: `Every year on ${startDate.format("MMMM D")}` },
    { key: "custom", label: "Custom..." },
  ];

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuickSelect = (option: RepeatOption | "custom") => {
    if (option === "custom") {
      setShowCustomDialog(true);
      handleClose();
      return;
    }

    const newRrule = generateRrule(rrule, option, startDate);
    setValue("rrule", newRrule);

    if (!dtstartLocal) {
      if (option !== "weekdays") {
        setValue("dtstart_local", startDate);
      } else {
        const day = startDate.day();
        if (day === 6) {
          setValue("dtstart_local", startDate.add(2, "day"));
        } else if (day === 0) {
          setValue("dtstart_local", startDate.add(1, "day"));
        } else {
          setValue("dtstart_local", startDate);
        }
      }
    }

    if (dtstartLocal) {
      if (option !== "weekdays") {
        setValue("dtstart_local", dtstartLocal);
      } else {
        const day = dtstartLocal.day();
        if (day === 6) {
          setValue("dtstart_local", dtstartLocal.add(2, "day"));
        } else if (day === 0) {
          setValue("dtstart_local", dtstartLocal.add(1, "day"));
        } else {
          setValue("dtstart_local", dtstartLocal);
        }
      }
    }
    handleClose();
  };

  const handleCustomSave = (rrule: string, anchor_mode: AnchorMode | null) => {
    setValue("rrule", rrule);
    setValue("anchor_mode", anchor_mode);
    setShowCustomDialog(false);
  };

  const handleClear = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setValue("rrule", null);
  };

  const displayText = isRepeating ? RRule.fromString(rrule).toText() : "Repeat";

  const open = Boolean(anchorEl);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
            <RepeatIcon />
          </ListItemIcon>
          <ListItemText primary={displayText} />
          {isRepeating && (
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

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          {quickOptions.map((option) => (
            <ListItem key={option.key} disablePadding>
              <ListItemButton onClick={() => handleQuickSelect(option.key)}>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>

      <RepeatOptionsCustom
        open={showCustomDialog}
        onClose={() => setShowCustomDialog(false)}
        onSave={handleCustomSave}
        dtstartLocal={dtstartLocal ? dayjs.tz(dtstartLocal, timezone) : null}
        rrule={rrule}
        anchor_mode={anchor_mode}
      />
    </>
  );
}
