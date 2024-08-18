import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Divider from '@mui/material/Divider';
import { Task } from "../types/common";
import TaskActionMenuIcon from "./TaskActionsMenuIcon";
import Stack from "@mui/material/Stack";
import QuickEditTaskIcon from "./QuickEditTaskIcon";
import TaskCheckIcon from "./TaskCheckIcon";
import { Typography } from "@mui/material";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={`calc(100vh - 64px)`}
      >
        <Typography>No tasks found.</Typography>
      </Box>
    );
  }

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
            <ListItemIcon>
              <TaskCheckIcon task={task} />
            </ListItemIcon>
            <ListItemText primary={task.title} secondary={task.note} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
