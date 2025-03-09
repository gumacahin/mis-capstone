import { useAuth0 } from "@auth0/auth0-react";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";

import LoginButton from "../components/LoginButton";
import AccountMenu from "./AccountMenu";

export default function Layout() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title="Application home">
            <Typography
              component={Button}
              color={"inherit"}
              variant="h6"
              sx={{ flexGrow: 1 }}
              onClick={handleHomeClick}
            >
              TODO APP
            </Typography>
          </Tooltip>
          <LoginButton />
          {isAuthenticated && <AccountMenu />}
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
