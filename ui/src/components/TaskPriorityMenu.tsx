import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import Button from "@mui/material/Button";
import ButtonGroup, { type ButtonGroupProps } from "@mui/material/ButtonGroup";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { type Control, Controller } from "react-hook-form";

import type { TaskFormFields, TaskPriority } from "../types/common";

const options: { value: TaskPriority; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Mid" },
  { value: "HIGH", label: "High" },
];

function ButtonIcon({
  priority,
  disabled,
}: {
  priority: TaskPriority;
  disabled?: boolean;
}) {
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
  ...props
}: {
  control: Control<TaskFormFields>;
  priority: TaskPriority;
} & ButtonGroupProps) {
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
          <ButtonGroup
            size="small"
            {...props}
            sx={{
              "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                borderRight: props.variant === "text" ? "none" : undefined, // Remove dividers for text variant
              },
              "& .MuiButtonGroup-grouped:not(:first-of-type)": {
                marginLeft: props.variant === "text" ? 0 : undefined, // Remove spacing for text variant
              },
            }}
          >
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
                variant={props.variant ? props.variant : "outlined"}
                sx={{
                  flexGrow: 1, // Allow this button to grow and occupy remaining space
                  flexShrink: 1, // Allow it to shrink if needed
                  textOverflow: "ellipsis", // Handle overflow gracefully
                  overflow: "hidden", // Hide overflowing text
                  whiteSpace: "nowrap", // Prevent text wrapping
                  ...(props.fullWidth && { justifyContent: "start" }),
                }}
              >
                {options.find((option) => option.value === priority)?.label}
              </Button>
            </Tooltip>
            {field.value !== "NONE" && (
              <Tooltip title="Remove task priority">
                <Button
                  size="small"
                  variant={props.variant ? props.variant : "outlined"}
                  onClick={() => {
                    field.onChange("NONE");
                  }}
                  sx={{
                    flexGrow: 0, // Prevent this button from growing
                    flexShrink: 0, // Prevent this button from shrinking
                    width: "auto", // Ensure it only takes up the space it needs
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
                    sx={[priority !== option.value && { display: "none" }]}
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
