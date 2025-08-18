import ListIcon from "@mui/icons-material/List";
import TuneIcon from "@mui/icons-material/Tune";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SkeletonList from "@shared/components/SkeletonList";
import { useLabel } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import type { ProjectViewType } from "@shared/types/common";
import InboxDefaultSectionProvider from "@views/components/InboxDefaultSectionProvider";
import LabelView from "@views/components/LabelView";
import ViewPageTitle from "@views/components/ViewPageTitle";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "use-local-storage";

export default function LabelTasksPage() {
  const { slug } = useParams();
  const { isPending, isError, data: label } = useLabel(slug!);
  const [view, setView] = useLocalStorage<ProjectViewType>(
    "upoutodo.labelView",
    "list",
  );
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();
  const navigate = useNavigate();

  const handleViewChange = useCallback(
    (view: ProjectViewType) => {
      setView(view);
    },
    [setView],
  );

  useEffect(() => {
    setToolbarIcons(
      <ViewMenu
        key="view-menu"
        view={view}
        handleViewChange={handleViewChange}
      />,
    );
    setToolbarTitle(
      <Stack direction="row" spacing={1} alignItems="center">
        <Button onClick={() => navigate("/labels")}>Labels /</Button>
        <ViewPageTitle title={label?.name} />
      </Stack>,
    );
    return () => {
      setToolbarIcons(null);
      setToolbarTitle(null);
    };
  }, [
    handleViewChange,
    setToolbarIcons,
    setToolbarTitle,
    view,
    navigate,
    label,
  ]);

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Alert severity="error">Failed to load tasks</Alert>
      </Box>
    );
  }

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <SkeletonList count={10} />
      </Box>
    );
  }

  return (
    <InboxDefaultSectionProvider>
      <LabelView view={view} label={label} />
    </InboxDefaultSectionProvider>
  );
}

function ViewMenu({
  view,
  handleViewChange,
}: {
  view: ProjectViewType;
  handleViewChange: (view: ProjectViewType) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
            value={view}
            onChange={(_, value) => {
              handleViewChange(value);
              handleClose();
            }}
          >
            <ToggleButton
              value="list"
              aria-label="list view"
              disabled={view === "list"}
            >
              <Stack alignItems={"center"}>
                <ListIcon />
                <small>List</small>
              </Stack>
            </ToggleButton>
            <ToggleButton
              value="board"
              aria-label="board view"
              disabled={view === "board"}
            >
              <Stack alignItems={"center"}>
                <ViewModuleIcon />
                <small>Board</small>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
      </Menu>
    </>
  );
}
