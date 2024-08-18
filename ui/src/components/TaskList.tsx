// import Box from '@mui/material/Box';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Divider from '@mui/material/Divider';
import { Task } from "../types/common";
import TaskActionMenuIcon from "./TaskActionsMenuIcon";
import Stack from "@mui/material/Stack";
import QuickEditTaskIcon from "./QuickEditTaskIcon";
import TaskCheckIcon from "./TaskCheckIcon";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <div>No tasks</div>;
  }
  // <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  // </Box>

  return (
    <>
      <List>
        {tasks.map((task: Task) => (
          <ListItem
            key={task.id}
            // NOTE: We use disabled padding there because of the stacked secondary actions
            // we have at teach ListItem. Without it the last icon button gets pushed
            // out of the ListItem
            disablePadding
            disableGutters
            secondaryAction={
              <Stack direction={"row"}>
                <QuickEditTaskIcon task={task} />
                <TaskActionMenuIcon task={task} />
              </Stack>
            }
          >
            <ListItemButton>
              <ListItemIcon>
                <TaskCheckIcon task={task} />
              </ListItemIcon>
              <ListItemText primary={task.title} secondary={task.note} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
