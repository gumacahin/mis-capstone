import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LabelIcon from "@mui/icons-material/Label";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";

import { useLabels } from "../api";
import type { IAddTaskFields } from "../types/common";

export default function TaskLabelsMenu({
  control,
  labels,
}: {
  control: Control<IAddTaskFields>;
  labels: string[];
}) {
  const { data } = useLabels();
  const results = React.useMemo(() => data?.results ?? [], [data]);
  const [labelOptions, setLabelOptions] = React.useState<string[]>([]);
  const [filteredLabelOptions, setFilteredLabelOptions] = React.useState<
    string[]
  >([]);
  React.useEffect(() => {
    const options = results.map(({ name }: { name: string }) => name);
    setFilteredLabelOptions(options);
    setLabelOptions(options);
  }, [results]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [search, setSearch] = React.useState<string>("");
  const open = Boolean(anchorEl);
  const handleClickMenuButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const searchValue = event.target.value.toLowerCase();
    const filteredLabels = labelOptions.filter((name) =>
      name.toLowerCase().includes(searchValue),
    );
    setSearch(searchValue);
    setTimeout(() => {
      setFilteredLabelOptions(filteredLabels);
    }, 0);
  };

  const handleClickLabel = (
    field: ControllerRenderProps<IAddTaskFields, "labels">,
    label: string,
  ) => {
    if (labels.includes(label)) {
      field.onChange(labels.filter((l) => l !== label));
    } else {
      field.onChange([...labels, label]);
    }
  };
  const handleCreateLabel = (
    field: ControllerRenderProps<IAddTaskFields, "labels">,
  ) => {
    if (search.length > 0) {
      setLabelOptions((prev) => [...prev, search]);
      setFilteredLabelOptions((prev) => [...prev, search]);
      field.onChange([...labels, search]);
    }
  };

  const hasLabels = labels.length > 0;
  const hasMoreThanOneLabel = labels.length > 1;
  const canCreateLabel =
    search.length > 0 &&
    (!labelOptions.includes(search) || filteredLabelOptions.length === 0);

  return (
    <Controller
      name="labels"
      control={control}
      defaultValue={labels}
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
                  {hasLabels ? labels[0] : "Labels"}
                </Button>
              </Tooltip>
              {hasLabels && (
                <Tooltip title="Remove label">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleClickLabel(field, labels[0]);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Tooltip>
              )}
            </ButtonGroup>
            {hasMoreThanOneLabel && (
              <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Add labels">
                  <Button
                    startIcon={<LabelIcon />}
                    variant="outlined"
                    size="small"
                    onClick={handleClickMenuButton}
                  >
                    {labels.slice(1).length}
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
          <Menu
            variant="menu"
            id="task-labels-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "task-labels-button",
              role: "listbox",
            }}
          >
            <MenuItem>
              <TextField
                id="task-labels-search"
                aria-label="Search for labels"
                placeholder="Type a label"
                variant="outlined"
                size="small"
                onKeyDown={(event) => {
                  // Prevent menu items from getting focused when typing.
                  event.stopPropagation();
                }}
                value={search}
                onChange={handleSearch}
              />
            </MenuItem>
            {filteredLabelOptions.map((label: string) => (
              <MenuItem
                onClick={() => handleClickLabel(field, label)}
                key={label}
              >
                <ListItemText>{label}</ListItemText>
                <Checkbox
                  checked={labels.includes(label)}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClickLabel(field, label);
                  }}
                />
              </MenuItem>
            ))}
            {filteredLabelOptions.length === 0 && (
              <MenuItem disabled>Label not found</MenuItem>
            )}
            {canCreateLabel && (
              <MenuItem onClick={() => handleCreateLabel(field)}>
                <AddIcon />
                <ListItemText>
                  Create new label &ldquo;{search}&rdquo;
                </ListItemText>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    />
  );
}
