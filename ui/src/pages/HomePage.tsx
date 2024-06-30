import useSuggestedTodos from "../data/use-suggested-todos";
import { Button, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

// const API_URL = "http://127.0.01:8000";

function HomePage() {
  const { isPending, error, data } = useSuggestedTodos();

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <List>
        { data.map((todo) => (
    <ListItem key={todo.id} disablePadding>
      <ListItemButton>
        <ListItemText primary={todo.title}  />
      </ListItemButton>
    </ListItem> ))}
    </List>
  );
}

export default HomePage;
