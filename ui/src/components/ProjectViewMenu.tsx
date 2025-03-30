import ListIcon from "@mui/icons-material/List";
import TuneIcon from "@mui/icons-material/Tune";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { debounce } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useQueryClient } from "@tanstack/react-query";
import { MouseEvent, useMemo, useState } from "react";

import { useUpdateProjectView } from "../hooks/queries";
import type { ProjectDetail, ProjectViewType } from "../types/common";

export default function ProjectViewMenu({
  project,
}: {
  project: ProjectDetail;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const queryClient = useQueryClient();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { mutateAsync } = useUpdateProjectView(project);
  const updateProjectViewType = useMemo(
    () =>
      debounce(async (view: ProjectViewType) => {
        await mutateAsync(view);
      }, 1000),
    [mutateAsync],
  );

  const handleChange = async (
    _: MouseEvent<HTMLElement>,
    value: ProjectViewType,
  ) => {
    if (value !== project.view) {
      queryClient.setQueryData(
        ["project", { projectId: project.id }],
        (oldProject: ProjectDetail | undefined) => {
          if (!oldProject) {
            return oldProject;
          }
          return {
            ...oldProject,
            view: value,
          };
        },
      );
      updateProjectViewType(value);
    }
  };

  return (
    <div>
      <Button
        id="view-menu-button"
        aria-controls={open ? "view-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<TuneIcon />}
      >
        View
      </Button>
      <Menu
        id="view-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "view-menu-button",
        }}
      >
        <MenuItem disableRipple>
          <ToggleButtonGroup
            id="view-options-label"
            exclusive
            aria-label="view options"
            aria-labelledby="view-options-label"
            value={project.view}
            onChange={handleChange}
          >
            <ToggleButton
              value="list"
              aria-label="list view"
              disabled={project.view === "list"}
            >
              <Stack alignItems={"center"}>
                <ListIcon />
                <small>List</small>
              </Stack>
            </ToggleButton>
            <ToggleButton
              value="board"
              aria-label="board view"
              disabled={project.view === "board"}
            >
              <Stack alignItems={"center"}>
                <ViewModuleIcon />
                <small>Board</small>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
      </Menu>
    </div>
  );
}
