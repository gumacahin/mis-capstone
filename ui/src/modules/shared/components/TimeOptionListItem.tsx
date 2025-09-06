import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

import { useTimezone } from "../hooks/useTimezone";
import {
  generateTimeOnlyRRule,
  parseTimeFromRRule,
  updateRRuleWithTime,
} from "../utils/rrule";
import TimeSelectionDialog from "./TimeSelectionDialog";

interface TimeOptionListItemProps {
  currentRRule?: string | null;
  onRRuleChange: (rrule: string | null) => void;
}

export default function TimeOptionListItem({
  currentRRule,
  onRRuleChange,
}: TimeOptionListItemProps) {
  const { timezone } = useTimezone();
  const [showDialog, setShowDialog] = useState(false);

  // Parse current time from RRule (memoized to avoid expensive parsing on every render)
  const currentTime = useMemo(() => {
    return parseTimeFromRRule(currentRRule || null, timezone);
  }, [currentRRule, timezone]);

  const hasTime = useMemo(() => {
    return currentTime && !currentTime.isSame(dayjs().startOf("day"));
  }, [currentTime]);

  const handleTimeClick = () => {
    setShowDialog(true);
  };

  const handleTimeSave = (newTime: Dayjs | null) => {
    if (currentRRule) {
      // Update existing RRule with new time
      const updatedRRule = updateRRuleWithTime(currentRRule, newTime, timezone);
      onRRuleChange(updatedRRule);
    } else if (newTime) {
      // If no RRule exists, create a time-only RRule
      // This will use current date as placeholder, to be updated when date is selected
      const timeOnlyRRule = generateTimeOnlyRRule(newTime, timezone);
      onRRuleChange(timeOnlyRRule);
    } else {
      // If newTime is null and no RRule exists, do nothing
      onRRuleChange(null);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (currentRRule) {
      // Set time to midnight (00:00:00)
      const updatedRRule = updateRRuleWithTime(currentRRule, null, timezone);
      onRRuleChange(updatedRRule);
    } else {
      // If no RRule exists, clear any time-only RRule
      onRRuleChange(null);
    }
  };

  const formatTime = (time: Dayjs | null) => {
    if (!time) {
      return "Time";
    }
    return time.format("h:mm A");
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleTimeClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary={formatTime(currentTime)} />
          </div>
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

      <TimeSelectionDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleTimeSave}
        currentRRule={currentRRule}
      />
    </>
  );
}
