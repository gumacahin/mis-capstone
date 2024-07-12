import { Outlet } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { useAuth0 } from '@auth0/auth0-react';
import AccountMenu from "./AccountMenu";

export default function Layout() {
    const { isAuthenticated } = useAuth0();
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                TODO APP
            </Typography>
            <LoginButton />
            { isAuthenticated && <AccountMenu /> }
            </Toolbar>
        </AppBar>
        <Container>
            <Outlet />
        </Container>
        </Box>
    );
}
