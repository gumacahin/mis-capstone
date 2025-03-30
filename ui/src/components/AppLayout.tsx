import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import TodayIcon from "@mui/icons-material/Today";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { Alert, Skeleton } from "@mui/material";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { styled, type Theme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { ReactNode, useState } from "react";
import {
  generatePath,
  NavLink,
  NavLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useProjects } from "../api";
import { ROUTES } from "../routes";
import { IProject } from "../types/common";
import AccountMenu from "./AccountMenu";
import AddProjectDialog from "./AddProjectDialog";
import AddTaskDialog from "./AddTaskDialog";
import ProjectMenu from "./ProjectMenu";

const drawerWidth = 240;

type RouterLinkProps = React.PropsWithChildren<{
  to: string;
  text: string;
  icon?: ReactNode;
  disablePadding?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  secondaryAction?: ReactNode;
  showProjectAddIcon?: boolean;
  handleAddProjectClick?: () => void;
  handleExpandProjectClick?: () => void;
  isProjectListOpen?: boolean;
}> &
  Omit<ListItemButtonProps, "component">;

const RouterLink = (props: RouterLinkProps) => {
  type MyNavLinkProps = Omit<NavLinkProps, "to">;
  const location = useLocation();
  const isAddingTask = location.hash === "#add-task";
  const MemoedNavLink = React.useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      React.forwardRef<HTMLAnchorElement, MyNavLinkProps>(
        (navLinkProps, ref) => {
          const { className: previousClasses, ...rest } = navLinkProps;
          const elementClasses = previousClasses?.toString() ?? "";
          return (
            <NavLink
              {...rest}
              ref={ref}
              to={props.to}
              end
              className={({ isActive }) =>
                // FIXME: these are unnecessary
                !isAddingTask && isActive
                  ? elementClasses + " Mui-selected"
                  : elementClasses
              }
            />
          );
        },
      ),
    [props.to, isAddingTask],
  );

  MemoedNavLink.displayName = "MemoedNavLink";

  return (
    <ListItem
      disablePadding
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      secondaryAction={props.secondaryAction}
    >
      <ListItemButton component={MemoedNavLink}>
        {props.icon && (
          <ListItemIcon
            sx={{
              ".Mui-selected > &": {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {props.icon}
          </ListItemIcon>
        )}
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  );
};

RouterLink.displayName = "RouterLink";

const ProjectListSkeleton = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <ListItem key={index} sx={{ pb: 2 }}>
      <Skeleton variant="rectangular" width={230} height={10} />
    </ListItem>
  ));
};

const ProjectListError = () => {
  return <Alert severity="error">Error loading projects</Alert>;
};

function DrawerContents({
  theme,
  handleDrawerClose,
  handleAddTaskDialogOpen,
  isLargeDisplay,
}: {
  handleDrawerClose: () => void;
  handleAddTaskDialogOpen: () => void;
  isLargeDisplay: boolean;
  theme: Theme;
}) {
  const [isProjectListOpen, setProjectListOpen] = useState(false);
  const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [projectsMenuItemHovered, setProjectsMenuItemHovered] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<
    "add-task" | "projects" | "add-project" | null
  >(null);
  // TODO: use a reducer here
  const [isAddingTask, setAddingTask] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [project, setProject] = useState<IProject | null>(null);
  const navigate = useNavigate();
  const {
    isPending: isProjectsPending,
    isError: isProjectsError,
    data: projectsData,
  } = useProjects();

  const handleOpenProjectMenu = (
    event: MouseEvent<HTMLButtonElement>,
    project: IProjectOption,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setProject(project);
  };

  const handleCloseProjectMenu = () => {
    setAnchorEl(null);
  };

  const projects: IProject[] = projectsData?.results ?? [];
  const handleAddTaskClick = () => {
    handleAddTaskDialogOpen();
    setAddingTask(true);
  };
  const handleAddProjectClick = () => {
    setAddProjectDialogOpen(true);
    setSelectedMenuItem("add-project");
  };
  const handleExpandProjectClick = () => {
    setProjectListOpen(!isProjectListOpen);
  };

  return (
    <>
      {project && (
        <ProjectMenu
          anchorEl={anchorEl}
          project={project}
          handleClose={handleCloseProjectMenu}
        />
      )}
      <AddProjectDialog
        open={isAddProjectDialogOpen}
        handleClose={() => {
          setAddProjectDialogOpen(false);
        }}
      />
      <DrawerHeader>
        <Box
          sx={{
            width: "100%",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <AccountMenu />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Box>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItemButton onClick={handleAddTaskClick}>
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary={"Add Task"} />
        </ListItemButton>
        <RouterLink to={ROUTES.INBOX} text="Inbox" icon={<InboxIcon />} />
        <RouterLink to={ROUTES.TODAY} text="Today" icon={<TodayIcon />} />
        <RouterLink
          to={ROUTES.UPCOMING}
          text="Upcoming"
          icon={<UpcomingIcon />}
        />
        <Divider />
        <RouterLink
          to={ROUTES.PROJECTS}
          text="My Projects"
          disablePadding
          handleAddProjectClick={handleAddProjectClick}
          handleExpandProjectClick={handleExpandProjectClick}
          isProjectListOpen={isProjectListOpen}
          showProjectAddIcon={projectsMenuItemHovered}
          onMouseEnter={() => setProjectsMenuItemHovered(true)}
          onMouseLeave={() => setProjectsMenuItemHovered(false)}
          secondaryAction={
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleAddProjectClick}
                edge="end"
                aria-label="add project"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleExpandProjectClick}
                edge="end"
                aria-label="expand projects list"
              >
                {isProjectListOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          }
        />
        <Collapse in={isProjectListOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {isProjectsPending && <ProjectListSkeleton />}
            {isProjectsError && <ProjectListError />}
            {projects &&
              projects.map((project: IProject) => (
                <RouterLink
                  to={generatePath("project/:projectId", {
                    projectId: `${project.id}`,
                  })}
                  text={project.title}
                  key={project.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      onClick={(e) => handleOpenProjectMenu(e, project)}
                      edge="end"
                      aria-label="project options"
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  }
                />
              ))}
          </List>
        </Collapse>
      </List>
    </>
  );
}

const Main = styled("main", {
  shouldForwardProp: (prop: string) => !["open", "sx"].includes(prop),
})<{
  open?: boolean;
}>(({ theme }) => ({
  overflow: "hidden",
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AppLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isLargeDisplay = useMediaQuery("(min-width:751px)");
  const [open, setOpen] = useState(isLargeDisplay);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        handleClose={() => {
          setIsAddTaskDialogOpen(false);
        }}
      />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          open={open}
          elevation={0}
          sx={{ backgroundColor: "transparent" }}
        >
          <Toolbar>
            <IconButton
              color="default"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                // TODO: do we need this?
                {
                  mr: 2,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {!isLargeDisplay && (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            anchor="left"
            open={open}
          >
            <DrawerContents
              isLargeDisplay={isLargeDisplay}
              theme={theme}
              handleDrawerClose={handleDrawerClose}
              handleAddTaskDialogOpen={() => {
                setIsAddTaskDialogOpen(true);
              }}
            />
          </Drawer>
        )}
        {isLargeDisplay && (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerContents
              theme={theme}
              handleDrawerClose={handleDrawerClose}
              isLargeDisplay={isLargeDisplay}
              handleAddTaskDialogOpen={() => {
                setIsAddTaskDialogOpen(true);
              }}
            />
          </Drawer>
        )}
        <Main
          // FIXME: this sx is showing in the dom
          sx={{
            marginLeft: isLargeDisplay ? undefined : "unset",
          }}
          open={open}
        >
          {/* <Box minHeight={`calc(100vh - 72px)`}> */}
          <Box
            minHeight={(theme) =>
              `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`
            }
            pt={8}
          >
            {children}
          </Box>
        </Main>
      </Box>
    </>
  );
}
