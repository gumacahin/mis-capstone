import EventIcon from "@mui/icons-material/Event";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "dayjs";
import { useState } from "react";

// import Divider from '@mui/material/Divider';
import { Task } from "../types/common";
import TaskCheckIcon from "./TaskCheckIcon";
import UpdateTaskDialog from "./UpdateTaskDialog";

export default function TaskList({
  tasks,
  hideDueDates,
}: {
  tasks: Task[];
  hideDueDates?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);

  const handleOpenTask = (task: Task) => {
    setTask(task);
    setOpen(true);
  };

  return (
    <>
      {task && (
        <UpdateTaskDialog
          open={open}
          handleClose={() => {
            setOpen(false);
            setTask(null);
          }}
          task={task}
        />
      )}
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
              <ListItemButton onClick={() => handleOpenTask(task)}>
                <ListItemIcon>
                  <TaskCheckIcon task={task} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "default",
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
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
