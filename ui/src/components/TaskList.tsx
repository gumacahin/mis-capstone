import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Divider from '@mui/material/Divider';
import { Task } from "../types/common";
import TaskCheckIcon from "./TaskCheckIcon";
import EventIcon from "@mui/icons-material/Event";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

export default function TaskList({
  tasks,
  hideDueDates,
}: {
  tasks: Task[];
  hideDueDates?: boolean;
}) {
  // if (tasks.length === 0) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center">
  //       <Typography>No tasks found.</Typography>
  //     </Box>
  //   );
  // }
  // if (tasks.length === 0) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center">
  //       <Typography>No tasks found.</Typography>
  //     </Box>
  //   );
  // }

  return (
    <List>
      {tasks.map((task: Task) => {
        const isOverdue =
          task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day");
        return (
          <ListItem
            key={task.id}
            // NOTE: We use disabled padding there because of the stacked secondary actions
            // we have at teach ListItem. Without it the last icon button gets pushed
            // out of the ListItem
            disablePadding
            disableGutters
          >
            <ListItemIcon>
              <TaskCheckIcon task={task} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    textDecoration: task.completed ? "line-through" : "default",
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    sx={{
                      textDecoration: task.completed
                        ? "line-through"
                        : "default",
                    }}
                  >
                    {task.note}
                  </Typography>
                  {!hideDueDates && task.due_date && (
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      sx={isOverdue ? { color: "rgb(209, 69, 59)" } : {}}
                    >
                      <EventIcon fontSize="small" />
                      <Typography ml="10px" variant={"caption"}>
                        {dayjs(task.due_date).format("MMM D YYYY")}
                      </Typography>
                    </Box>
                  )}
                </>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
