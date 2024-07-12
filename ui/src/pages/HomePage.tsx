import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useSuggestedTodos from "../data/use-suggested-todos";

// const API_URL = "http://127.0.01:8000";

function HomePage() {
  const { isPending, error, data } = useSuggestedTodos();

  if (error) {
    throw error.message;
  }

  if (isPending) return "Loading...";

  return (
    <>
      <List>
      { data.map((todo) => (
        <ListItem key={todo.id} disablePadding>
          <ListItemButton>
            <ListItemText primary={todo.title}  />
          </ListItemButton>
        </ListItem> ))}
      </List>
    </>
  );
}

export default HomePage;
