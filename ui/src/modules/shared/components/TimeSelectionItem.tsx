import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { Dayjs } from "dayjs";
import React, { useState } from "react";

import TimePicker from "./TimePicker";

interface TimeSelectionItemProps {
  value: Dayjs | null;
  onChange: (newDateTime: Dayjs | null) => void;
  disabled?: boolean;
}

const TimeSelectionItem: React.FC<TimeSelectionItemProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [timeAnchorEl, setTimeAnchorEl] = useState<HTMLElement | null>(null);
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeId] = useState(`time-picker-${Math.random()}`);

  const handleTimeClick = (event: React.MouseEvent<HTMLElement>) => {
    setTimeAnchorEl(event.currentTarget);
    setTimeOpen(true);
  };

  const handleTimeClose = () => {
    setTimeAnchorEl(null);
    setTimeOpen(false);
  };

  const hasTime = value && (value.hour() !== 0 || value.minute() !== 0);

  const handleClearTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear time but keep date
    const dateOnly = value?.startOf("day") || null;
    onChange(dateOnly);
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleTimeClick}
          component="button"
          disabled={disabled}
        >
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary={hasTime ? value.format("h:mm A") : "Time"} />
          {hasTime && (
            <Tooltip title="Clear time">
              <Button
                size="small"
                variant="text"
                onClick={handleClearTime}
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
      <Popover
        id={timeId}
        open={timeOpen}
        anchorEl={timeAnchorEl}
        onClose={handleTimeClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <TimePicker
          value={value}
          onChange={(newDateTime) => {
            // TimePicker now handles all the logic including smart date assignment
            onChange(newDateTime);
            handleTimeClose();
          }}
          onCancel={handleTimeClose}
          currentDate={value}
        />
      </Popover>
    </>
  );
};

export default TimeSelectionItem;
