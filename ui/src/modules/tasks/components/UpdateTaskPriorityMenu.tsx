import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import Button from "@mui/material/Button";
import ButtonGroup, { type ButtonGroupProps } from "@mui/material/ButtonGroup";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useUpdateTask } from "@shared/hooks/queries";
import type { TaskFormFields, TaskPriority } from "@shared/types/common";
import { Task } from "@shared/types/common";
import { MouseEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const options: { value: TaskPriority; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Mid" },
  { value: "HIGH", label: "High" },
];

function ButtonIcon({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case "LOW":
      return <FlagIcon fontSize="small" color="info" />;
    case "MEDIUM":
      return <FlagIcon fontSize="small" color="warning" />;
    case "HIGH":
      return <FlagIcon fontSize="small" color="error" />;
    default:
      return <FlagIcon fontSize="small" />;
  }
}

interface UpdateTaskPriorityMenuProps extends ButtonGroupProps {
  task: Task;
}

export default function UpdateTaskPriorityMenu({
  task,
  ...props
}: UpdateTaskPriorityMenuProps) {
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenuButton = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const defaultValues = {
    priority: task.priority,
  };

  const { control, handleSubmit, watch } = useForm<TaskFormFields>({
    defaultValues,
  });

  const displayValue = watch("priority");

  const onSubmit = async (data: TaskFormFields) => {
    setIsSubmitting(true);
    await toast.promise(
      updateTask({
        priority: data.priority,
      }),
      {
        loading: "Updating task priority...",
        success: "Task priority updated successfully!",
        error: "Failed to update task priority.",
      },
    );
    setIsSubmitting(false);
  };

  const taskIsCompleted = task.completion_date != null;

  return (
    <Controller
      name="priority"
      control={control}
      defaultValue={task.priority}
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
                  flexGrow: 1,
                  flexShrink: 1,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  ...(props.fullWidth && { justifyContent: "start" }),
                }}
                disabled={isSubmitting || taskIsCompleted}
              >
                {displayValue}
              </Button>
            </Tooltip>
            {field.value !== "NONE" && (
              <Tooltip title="Remove task priority">
                <Button
                  size="small"
                  variant={props.variant ? props.variant : "outlined"}
                  onClick={() => {
                    field.onChange("NONE");
                    handleSubmit(onSubmit)();
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
            sx={{ width: 400 }}
            id="task-priority-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                sx: { width: 200 },
                "aria-labelledby": "task-priority-button",
                role: "listbox",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                selected={task.priority === option.value}
                disabled={task.priority === option.value}
                onClick={() => {
                  field.onChange(option.value);
                  handleSubmit(onSubmit)();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <ButtonIcon priority={option.value} />
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
                <Typography variant="body2">
                  <CheckIcon
                    fontSize="small"
                    sx={[task.priority !== option.value && { display: "none" }]}
                  />
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    />
  );
}
