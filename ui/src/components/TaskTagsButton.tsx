import CloseIcon from "@mui/icons-material/Close";
import LabelIcon from "@mui/icons-material/Label";
import Button from "@mui/material/Button";
import ButtonGroup, { type ButtonGroupProps } from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { MouseEvent, useState } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";

import type { ITaskFormFields } from "../types/common";
import TaskTagsMenu from "./TaskTagsMenu";

export default function TaskTagsButton({
  control,
  tags,
  compact, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  control: Control<ITaskFormFields>;
  tags: string[];
  compact?: boolean;
} & ButtonGroupProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickMenuButton = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickTag = (
    field: ControllerRenderProps<ITaskFormFields, "tags">,
    tag: string,
  ) => {
    if (tags.includes(tag)) {
      field.onChange(tags.filter((t) => t !== tag));
    } else {
      field.onChange([...tags, tag]);
    }
  };

  const hasTags = tags.length > 0;
  const hasMoreThanOneTag = tags.length > 1;

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={tags}
      render={({ field }) => (
        <>
          <Stack direction="row" spacing={1}>
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title="Add labels">
                <Button
                  startIcon={<LabelIcon />}
                  variant="outlined"
                  size="small"
                  onClick={handleClickMenuButton}
                >
                  {hasTags ? tags[0] : "Labels"}
                </Button>
              </Tooltip>
              {hasTags && (
                <Tooltip title="Remove label">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleClickTag(field, tags[0]);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Tooltip>
              )}
            </ButtonGroup>
            {hasMoreThanOneTag && (
              <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Add labels">
                  <Button
                    startIcon={<LabelIcon />}
                    variant="outlined"
                    size="small"
                    onClick={handleClickMenuButton}
                  >
                    {tags.slice(1).length}
                  </Button>
                </Tooltip>
                <Tooltip title="Remove all labels">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      field.onChange([]);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            )}
          </Stack>
          <TaskTagsMenu
            handleClose={handleClose}
            anchorEl={anchorEl}
            field={field}
            handleClickTag={handleClickTag}
            tags={tags}
          />
        </>
      )}
    />
  );
}
