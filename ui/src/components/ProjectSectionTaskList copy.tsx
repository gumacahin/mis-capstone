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

import type { ISection, ITask } from "../types/common";
import TaskCheckIcon from "./TaskCheckIcon";
import UpdateTaskDialog from "./UpdateTaskDialog";

export default function ProjectSectionTaskList({
  section,
  hideDueDates,
}: {
  section: ISection;
  hideDueDates?: boolean;
}) {
  const [taskForUpdating, setTaskForUpdating] = useState<ITask | null>(null);
  const tasks = section.tasks;
  const handleOpenTask = (task: ITask) => {
    setTaskForUpdating(task);
  };

  const handleClose = () => {
    setTaskForUpdating(null);
  };

  return (
    <>
      <List>
        {tasks.map((task: ITask) => {
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
              <UpdateTaskDialog
                section={section}
                open={task.id === taskForUpdating?.id}
                handleClose={handleClose}
                task={task}
              />
              <ListItemButton
                onClick={() => {
                  handleOpenTask(task);
                }}
              >
                <ListItemIcon>
                  <TaskCheckIcon task={task} projectId={section.project} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        textDecoration: task.completion_date
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
                          textDecoration: task.completion_date
                            ? "line-through"
                            : "default",
                        }}
                      >
                        {task.description}
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
                  slotProps={{
                    primary: { component: "div" },
                    secondary: { component: "div" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
