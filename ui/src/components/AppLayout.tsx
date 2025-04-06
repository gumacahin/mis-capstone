import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
} from "@hello-pangea/dnd";
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
import Alert from "@mui/material/Alert";
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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { styled, type Theme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQueryClient } from "@tanstack/react-query";
import { MouseEvent, ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { generatePath } from "react-router-dom";

import { useProjects, useReorderProjects } from "../api";
import useToolbarContext from "../hooks/useToolbarContext";
import { ROUTES } from "../routes";
import { Project } from "../types/common";
import AccountMenu from "./AccountMenu";
import AddProjectDialog from "./AddProjectDialog";
import AddTaskDialog from "./AddTaskDialog";
import InboxDefaultSectionProvider from "./InboxDefaultSectionProvider";
import ListItemNavLink from "./ListItemNavLink";
import ProjectMenu from "./ProjectMenu";

const DRAWER_WIDTH = 240;

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [project, setProject] = useState<Project | null>(null);
  const reorderProjects = useReorderProjects();

  console.log("isLargeDisplay", isLargeDisplay);

  const {
    isPending: isProjectsPending,
    isError: isProjectsError,
    data: projectsData,
  } = useProjects();

  const projects = projectsData?.results || [];

  const handleOpenProjectMenu = (
    event: MouseEvent<HTMLButtonElement>,
    project: Project,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setProject(project);
  };

  const handleCloseProjectMenu = () => {
    setAnchorEl(null);
  };

  const handleAddTaskClick = () => {
    handleAddTaskDialogOpen();
  };
  const handleAddProjectClick = () => {
    setAddProjectDialogOpen(true);
  };
  const handleExpandProjectClick = () => {
    setProjectListOpen(!isProjectListOpen);
  };

  const handleDragEnd = async ({
    destination,
    source,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newProjectList = Array.from(projects) as Project[];
    const [removed] = newProjectList.splice(source.index, 1);
    newProjectList.splice(destination.index, 0, removed);
    const reorderedProjects = newProjectList.map(
      (project: Project, index: number) => ({
        ...project,
        order: index + 1,
      }),
    );
    await toast.promise(reorderProjects.mutateAsync(reorderedProjects), {
      loading: "Reordering projects...",
      error: "Failed reordering projects.",
      success: "Projects reordered successfully!",
    });
  };

  const listItemIconStyle: {
    [key: string]: {
      color: (theme: Theme) => string;
    };
  } = {
    ".Mui-selected > &": {
      color: (theme) => theme.palette.primary.main,
    },
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
      <List component="nav">
        <ListItem component={"div"} disableGutters disablePadding>
          <ListItemButton onClick={handleAddTaskClick}>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Add task"} />
          </ListItemButton>
        </ListItem>
        <ListItem component={"div"} disableGutters disablePadding>
          <ListItemNavLink to={ROUTES.INBOX}>
            <ListItemIcon sx={listItemIconStyle}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={"Inbox"} />
          </ListItemNavLink>
        </ListItem>
        <ListItem component={"div"} disableGutters disablePadding>
          <ListItemNavLink to={ROUTES.TODAY}>
            <ListItemIcon sx={listItemIconStyle}>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary={"Today"} />
          </ListItemNavLink>
        </ListItem>
        <ListItem component={"div"} disableGutters disablePadding>
          <ListItemNavLink to={ROUTES.UPCOMING}>
            <ListItemIcon sx={listItemIconStyle}>
              <UpcomingIcon />
            </ListItemIcon>
            <ListItemText primary={"Upcoming"} />
          </ListItemNavLink>
        </ListItem>
        <Divider />
        <ListItem
          component={"div"}
          disableGutters
          disablePadding
          onMouseEnter={() => setProjectsMenuItemHovered(true)}
          onMouseLeave={() => setProjectsMenuItemHovered(false)}
          secondaryAction={
            <>
              <IconButton
                onClick={handleAddProjectClick}
                aria-label="add project"
                sx={[!projectsMenuItemHovered && { display: "none" }]}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleExpandProjectClick}
                aria-label="expand projects list"
              >
                {isProjectListOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </>
          }
        >
          <ListItemNavLink to={ROUTES.PROJECTS}>
            <ListItemText primary={"My Projects"} />
          </ListItemNavLink>
        </ListItem>
        <Collapse in={isProjectListOpen} timeout="auto" unmountOnExit>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <List
                  disablePadding
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {isProjectsPending && <ProjectListSkeleton />}
                  {isProjectsError && <ProjectListError />}
                  {projects.map((project: Project, index: number) => (
                    <Draggable
                      key={project.id}
                      draggableId={`${project.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <ListItem
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.background.paper,
                          }}
                          key={project.id}
                          disableGutters
                          disablePadding
                          secondaryAction={
                            <IconButton
                              onClick={(e) => handleOpenProjectMenu(e, project)}
                              aria-label="project options"
                            >
                              <MoreHorizIcon />
                            </IconButton>
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <ListItemNavLink
                            to={generatePath("project/:projectId", {
                              projectId: `${project.id}`,
                            })}
                          >
                            <ListItemText primary={project.title} />
                          </ListItemNavLink>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
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
  marginLeft: `-${DRAWER_WIDTH}px`,
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
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: `${DRAWER_WIDTH}px`,
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
  const { toolbarItems } = useToolbarContext();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <InboxDefaultSectionProvider>
        <AddTaskDialog
          open={isAddTaskDialogOpen}
          handleClose={() => {
            setIsAddTaskDialogOpen(false);
          }}
        />
      </InboxDefaultSectionProvider>
      <Box sx={{ display: "flex" }} height="100vh" id="app-layout">
        <AppBar
          position="fixed"
          open={open}
          elevation={0}
          sx={{ backgroundColor: "background.default" }}
        >
          <Toolbar
            sx={{
              justifyContent: "start",
              width: "100%",
            }}
          >
            <IconButton
              color="default"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[open && { display: "none" }]}
            >
              <MenuIcon />
            </IconButton>
            <Box width="100%">{toolbarItems}</Box>
          </Toolbar>
        </AppBar>
        {!isLargeDisplay && (
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
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
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
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
        <Main sx={[!isLargeDisplay && { marginLeft: "unset" }]} open={open}>
          <Box
            minHeight={(theme) =>
              `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`
            }
            pt={8}
            id="main-content-wrapper"
          >
            {children}
          </Box>
        </Main>
      </Box>
    </>
  );
}
