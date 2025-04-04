import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";

import type { ITaskFormFields } from "../types/common";
import TaskLabelsMenu from "./TaskTagsMenu";

export default function UpdateTaskLabels({
  control,
  labels,
  disabled,
}: {
  control: Control<ITaskFormFields>;
  labels: string[];
  disabled: boolean;
} & ButtonGroupProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpenTagsMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickLabel = (
    field: ControllerRenderProps<ITaskFormFields, "labels">,
    label: string,
  ) => {
    if (labels.includes(label)) {
      field.onChange(labels.filter((l) => l !== label));
    } else {
      field.onChange([...labels, label]);
    }
  };

  const handleDelete = (
    field: ControllerRenderProps<ITaskFormFields, "labels">,
    labelToDelete: string,
  ) => {
    field.onChange(labels.filter((label: string) => label !== labelToDelete));
  };

  return (
    <Controller
      name="labels"
      control={control}
      defaultValue={labels}
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
          <TaskLabelsMenu
            handleClose={handleClose}
            anchorEl={anchorEl}
            field={field}
            handleClickLabel={handleClickLabel}
            labels={labels}
          />
          {labels.length > 1 && (
            <Stack
              direction={"row"}
              spacing={1}
              flexWrap={"wrap"}
              useFlexGap
              my={1}
            >
              {labels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  variant="filled"
                  onDelete={() => handleDelete(field, label)}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    />
  );
}
