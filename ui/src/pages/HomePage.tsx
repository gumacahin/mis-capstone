import useSuggestedTodos from "../data/use-suggested-todos";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

// const API_URL = "http://127.0.01:8000";

function HomePage() {
  const { isPending, error, data } = useSuggestedTodos();

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

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
          <LogoutButton />
        </Toolbar>
      </AppBar>
    <List>
        { data.map((todo) => (
    <ListItem key={todo.id} disablePadding>
      <ListItemButton>
        <ListItemText primary={todo.title}  />
      </ListItemButton>
    </ListItem> ))}
    </List>
    </Box>
  );
}

export default HomePage;
