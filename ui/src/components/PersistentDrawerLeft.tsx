import { useEffect, useState } from "react";
import { styled, useTheme, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import TodayIcon from "@mui/icons-material/Today";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import AddTodoDialog from "./AddTodoDialog";
import { Add } from "@mui/icons-material";

const drawerWidth = 240;

function DrawerContents({
  theme,
  handleDrawerClose,
  handleAddTodoDialogOpen,
  isLargeDisplay,
}: {
  handleDrawerClose: () => void;
  handleAddTodoDialogOpen: () => void;
  theme: Theme;
  isLargeDisplay?: boolean;
}) {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const handleClick = (callback: () => void) => {
    return () => {
      callback();
      if (!isLargeDisplay) {
        handleDrawerClose();
      }
    };
  };
  return (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleClick(() => handleAddTodoDialogOpen())}
          >
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Add Task"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick(() => navigate("inbox"))}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={"Inbox"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick(() => navigate("today"))}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary={"Today"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick(() => navigate("upcoming"))}>
            <ListItemIcon>
              <UpcomingIcon />
            </ListItemIcon>
            <ListItemText primary={"Upcoming"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick(() => navigate("settings"))}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick(() => logout())}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
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

export default function PersistentDrawerLeft({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isLargeDisplay = useMediaQuery("(min-width:751px)");
  const [open, setOpen] = useState(false);
  const [isAddTodoDialogOpen, setIsAddTodoDialogOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AddTodoDialog
        open={isAddTodoDialogOpen}
        handleClose={() => setIsAddTodoDialogOpen(false)}
      />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Persistent drawer
            </Typography>
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
              theme={theme}
              handleDrawerClose={handleDrawerClose}
              handleAddTodoDialogOpen={() => setIsAddTodoDialogOpen(true)}
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
              isLargeDisplay
              handleAddTodoDialogOpen={() => setIsAddTodoDialogOpen(true)}
            />
          </Drawer>
        )}
        <Main sx={[!isLargeDisplay && { marginLeft: "unset" }]} open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    </>
  );
}
