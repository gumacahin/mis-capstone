import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import { useTimezone } from "../hooks/useTimezone";
import {
  convertToSingleOccurrence,
  generateRepeatRRuleWithTime,
  generateSingleOccurrenceRRule,
  isRecurring,
  parseRRuleToDate,
  parseRRuleToDisplay,
} from "../utils/rrule";
import RepeatOptions from "./RepeatOptions";

interface RepeatOptionListItemProps {
  currentRRule: string | null | undefined;
  onRRuleChange: (rrule: string | null) => void;
}

export default function RepeatOptionListItem({
  currentRRule,
  onRRuleChange,
}: RepeatOptionListItemProps) {
  const { timezone } = useTimezone();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [basedOn] = useState<"SCHEDULED" | "COMPLETED">("SCHEDULED");

  // Parse date from currentRRule, or fallback to current date
  const effectiveDate =
    (currentRRule ? parseRRuleToDate(currentRRule, timezone) : null) ||
    dayjs().tz(timezone);

  // Dynamic quick options based on the effective date
  const quickOptions = [
    { key: "daily", label: "Every day" },
    { key: "weekly", label: `Every week on ${effectiveDate.format("dddd")}` },
    { key: "weekdays", label: "Every weekday (Mon - Fri)" },
    { key: "monthly", label: `Every month on the ${effectiveDate.date()}th` },
    { key: "yearly", label: `Every year on ${effectiveDate.format("MMMM D")}` },
    { key: "custom", label: "Custom..." },
  ];

  const isRepeating = isRecurring(currentRRule);
  const displayText = parseRRuleToDisplay(currentRRule);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuickSelect = (option: string) => {
    if (option === "custom") {
      setShowCustomDialog(true);
      handleClose();
      return;
    }

    if (option === "none") {
      onRRuleChange(null);
    } else {
      // Use generateRepeatRRuleWithTime to preserve existing time when setting repeat
      const rrule = generateRepeatRRuleWithTime(
        currentRRule || null,
        option as "daily" | "weekly" | "weekdays" | "monthly" | "yearly",
        effectiveDate,
        timezone,
        basedOn,
      );
      if (rrule) {
        onRRuleChange(rrule);
      }
    }
    handleClose();
  };

  const handleCustomSave = (rrule: string) => {
    onRRuleChange(rrule);
    setShowCustomDialog(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Convert recurring RRULE to single occurrence (COUNT=1) while preserving time
    if (currentRRule) {
      const singleOccurrenceRRule = convertToSingleOccurrence(currentRRule);
      onRRuleChange(singleOccurrenceRRule);
    } else {
      // Fallback to generating new single occurrence if no current RRULE
      const singleOccurrenceRRule = generateSingleOccurrenceRRule(
        effectiveDate,
        timezone,
      );
      onRRuleChange(singleOccurrenceRRule);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText primary={displayText} />
          </div>
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

      <RepeatOptions
        open={showCustomDialog}
        onClose={() => setShowCustomDialog(false)}
        onSave={handleCustomSave}
        selectedDate={effectiveDate}
        currentRRule={currentRRule}
      />
    </>
  );
}
