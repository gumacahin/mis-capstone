import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { type Control, Controller } from "react-hook-form";

import type { IAddTaskFields, TTaskPriority } from "../types/common";

const options: { value: TTaskPriority; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Mid" },
  { value: "HIGH", label: "High" },
];

function ButtonIcon({ priority }: { priority: TTaskPriority }) {
  switch (priority) {
    case "LOW":
      return <FlagIcon fontSize="small" color="info" />;
    case "MEDIUM":
      return <FlagIcon fontSize="small" color="warning" />;
    case "HIGH":
      return <FlagIcon fontSize="small" color="error" />;
    default:
      return <OutlinedFlagIcon fontSize="small" />;
  }
}

export default function TaskPriorityMenu({
  control,
  priority,
}: {
  control: Control<IAddTaskFields>;
  priority: TTaskPriority;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenuButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Controller
      name="priority"
      control={control}
      defaultValue={priority}
      render={({ field }) => (
        <>
          <ButtonGroup variant="outlined" size="small">
            <Tooltip
              title={
                field.value === "NONE"
                  ? "Set task priority"
                  : "Change task priority"
              }
            >
              <Button
                startIcon={<ButtonIcon priority={field.value} />}
                id="task-priority-button"
                aria-haspopup="listbox"
                aria-controls="task-priority-menu"
                aria-label="Task priority"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickMenuButton}
                size="small"
                variant="outlined"
              >
                {options.find((option) => option.value === priority)?.label}
              </Button>
            </Tooltip>
            {field.value !== "NONE" && (
              <Tooltip title="Remove task priority">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    field.onChange("NONE");
                  }}
                >
                  <CloseIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}
          </ButtonGroup>
          <Menu
            id="task-priority-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "task-priority-button",
              role: "listbox",
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                selected={priority === option.value}
                onClick={() => {
                  field.onChange(option.value);
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <ButtonIcon priority={option.value} />
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
                <ListItemIcon>
                  <CheckIcon
                    fontSize="small"
                    sx={{
                      visibility:
                        priority === option.value ? "visible" : "hidden",
                    }}
                  />
                </ListItemIcon>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    />
  );
}
