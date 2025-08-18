import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TaskFormFields } from "@shared/types/common";
import { MouseEvent, useState } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";

import TaskTagsMenu from "./TaskTagsMenu";

export interface UpdateTaskTagsProps {
  control: Control<TaskFormFields>;
  tags: string[];
  disabled: boolean;
}

export default function UpdateTaskTags({
  control,
  tags,
  disabled,
}: UpdateTaskTagsProps) {
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
    if (tags.includes(tag)) {
      field.onChange(tags.filter((t) => t !== tag));
    } else {
      field.onChange([...tags, tag]);
    }
  };

  const handleDelete = (
    field: ControllerRenderProps<TaskFormFields, "tags">,
    tagToDelete: string,
  ) => {
    field.onChange(tags.filter((tag: string) => tag !== tagToDelete));
  };

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={tags}
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
            tags={tags}
          />
          {tags.length > 1 && (
            <Stack
              direction={"row"}
              spacing={1}
              flexWrap={"wrap"}
              useFlexGap
              my={1}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="filled"
                  onDelete={() => handleDelete(field, tag)}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    />
  );
}
