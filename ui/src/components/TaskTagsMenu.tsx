import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { type ControllerRenderProps } from "react-hook-form";

import { useTags } from "../api";
import { type TaskFormFields } from "../types/common";

export default function TaskTagsMenu({
  anchorEl,
  handleClose,
  handleClickTag,
  field,
  tags,
}: {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleClickTag: (
    field: ControllerRenderProps<TaskFormFields, "tags">,
    tag: string,
  ) => void;
  field: ControllerRenderProps<TaskFormFields, "tags">;
  tags: string[];
}) {
  const ITEM_HEIGHT = 48;
  const { data } = useTags();
  const results = useMemo(() => data?.results ?? [], [data]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [filteredTagOptions, setFilteredTagOptions] = useState<string[]>([]);

  useEffect(() => {
    const options = results.map(({ name }: { name: string }) => name);
    setFilteredTagOptions(options);
    setTagOptions(options);
  }, [results]);

  const [search, setSearch] = useState<string>("");
  const open = Boolean(anchorEl);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const searchValue = event.target.value.toLowerCase();
    const filteredTags = tagOptions.filter((name) =>
      name.toLowerCase().includes(searchValue),
    );
    setSearch(searchValue);
    setTimeout(() => {
      setFilteredTagOptions(filteredTags);
    }, 0);
  };

  const handleCreateTag = (
    field: ControllerRenderProps<TaskFormFields, "tags">,
  ) => {
    if (search.length > 0) {
      setTagOptions((prev) => [...prev, search]);
      setFilteredTagOptions((prev) => [...prev, search]);
      field.onChange([...tags, search]);
    }
  };

  const onClose = () => {
    setSearch("");
    handleClose();
  };

  const canCreateTag =
    search.length > 0 &&
    (!tagOptions.includes(search) || filteredTagOptions.length === 0);

  return (
    <Menu
      variant="menu"
      id="task-labels-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        "aria-labelledby": "task-labels-button",
        role: "listbox",
      }}
      slotProps={{
        paper: {
          style: {
            maxHeight: ITEM_HEIGHT * 6.5,
          },
        },
      }}
    >
      <MenuItem disableRipple>
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
      {filteredTagOptions.map((tag: string) => (
        <MenuItem onClick={() => handleClickTag(field, tag)} key={tag}>
          <ListItemText>{tag}</ListItemText>
          <Checkbox
            checked={tags.includes(tag)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleClickTag(field, tag);
            }}
          />
        </MenuItem>
      ))}
      {search && filteredTagOptions.length === 0 && (
        <MenuItem disabled>Label not found</MenuItem>
      )}
      {canCreateTag && (
        <MenuItem onClick={() => handleCreateTag(field)}>
          <AddIcon />
          <ListItemText>Create new label &ldquo;{search}&rdquo;</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}
