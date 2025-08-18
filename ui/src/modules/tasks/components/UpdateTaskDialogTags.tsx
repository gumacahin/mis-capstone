import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useUpdateTask } from "@shared/hooks/queries";
import type { TaskFormFields } from "@shared/types/common";
import { Task } from "@shared/types/common";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";

import TaskTagsMenu from "./TaskTagsMenu";

export interface UpdateTaskTagsProps {
  task: Task;
}

export default function UpdateTaskDialogTags({ task }: UpdateTaskTagsProps) {
  const { mutateAsync: updateTask } = useUpdateTask(task, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpenTagsMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickTag = (
    field: ControllerRenderProps<TaskFormFields, "tags">,
    tag: string,
  ) => {
    if (task.tags.includes(tag)) {
      field.onChange(task.tags.filter((t) => t !== tag));
    } else {
      field.onChange([...task.tags, tag]);
    }
  };

  const handleDelete = (
    field: ControllerRenderProps<TaskFormFields, "tags">,
    tagToDelete: string,
  ) => {
    field.onChange(task.tags.filter((tag: string) => tag !== tagToDelete));
  };

  const defaultValues = {
    tags: task.tags,
  };

  const { control, handleSubmit, watch } = useForm<TaskFormFields>({
    defaultValues,
  });

  const watchedTags = watch("tags");

  const onSubmit = useCallback(
    async (data: TaskFormFields) => {
      setIsSubmitting(true);
      try {
        await updateTask({
          tags: data.tags,
        });
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error updating task tags:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateTask],
  );

  useEffect(() => {
    const tagsChanged =
      JSON.stringify(watchedTags.sort()) !== JSON.stringify(task.tags.sort());
    if (tagsChanged) {
      handleSubmit(onSubmit)();
    }
  }, [watchedTags, handleSubmit, onSubmit, task]);

  const taskIsCompleted = task.completion_date != null;
  const disabled = taskIsCompleted || isSubmitting;

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={task.tags}
      render={({ field }) => (
        <>
          <Tooltip title="Change labels">
            <Button
              disabled={disabled}
              variant="text"
              size="small"
              fullWidth
              sx={{ justifyContent: "space-between", textTransform: "none" }}
              endIcon={<AddIcon />}
              color="inherit"
              onClick={handleOpenTagsMenu}
            >
              <Typography
                variant="subtitle2"
                sx={[
                  disabled && { color: (theme) => theme.palette.text.disabled },
                ]}
              >
                Labels
              </Typography>
            </Button>
          </Tooltip>
          <TaskTagsMenu
            handleClose={handleClose}
            anchorEl={anchorEl}
            field={field}
            handleClickTag={handleClickTag}
            tags={task.tags}
          />
          {watchedTags?.length > 0 && (
            <Stack
              direction={"row"}
              spacing={1}
              flexWrap={"wrap"}
              useFlexGap
              my={1}
            >
              {watchedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="filled"
                  onDelete={
                    task.completion_date
                      ? undefined
                      : () => handleDelete(field, tag)
                  }
                />
              ))}
            </Stack>
          )}
        </>
      )}
    />
  );
}
