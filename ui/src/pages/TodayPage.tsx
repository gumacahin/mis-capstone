import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import TodayIcon from "@mui/icons-material/Today";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WeekendIcon from "@mui/icons-material/Weekend";
import { Alert, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";
import { toast } from "react-hot-toast";

import { useRescheduleTasks, useTasksToday } from "../api";
import AddTodoButton from "../components/AddTodoButton";
import SkeletonList from "../components/SkeletonList";
import TaskList from "../components/TaskList";
import { Task } from "../types/common";

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: 0,
  margin: 0,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
}));

function RescheduleDialog({ tasks }: { tasks: Task[] }) {
  const rescheduleTasks = useRescheduleTasks(tasks);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReschedule = (date: Date | null) => {
    if (!date) {
      return;
    }
    const updatedTasks = tasks.map((task: Task) => {
      task.due_date = dayjs(date).format("YYYY-MM-DD");
      task.completed_date = "";
      return task;
    });
    toast.promise(rescheduleTasks.mutateAsync(updatedTasks), {
      loading: "Rescheduling tasks...",
      success: "Tasks rescheduled successfully!",
      error: "Error rescheduling task.",
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "reschedule-popover" : undefined;
  return (
    // FIXME: This is an a11y issue. The div should be a button.
    // eslint-disable-next-line
    <div onClick={(e) => e.stopPropagation()}>
      <Button onClick={handleClick} size="small">
        Reschedule
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(dayjs().toDate());
                handleClose();
              }}
            >
              <ListItemIcon>
                <TodayIcon />
              </ListItemIcon>
              <ListItemText primary={"Today"} />
              <ListItemSecondaryAction>
                {dayjs().format("ddd")}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(dayjs().add(1, "day").toDate());
                handleClose();
              }}
            >
              <ListItemIcon>
                <WbSunnyIcon />
              </ListItemIcon>
              <ListItemText primary={"Tomorrow"} />
              <ListItemSecondaryAction>
                {dayjs().add(1, "day").format("ddd")}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(
                  dayjs().startOf("week").add(6, "day").toDate(),
                );
                handleClose();
              }}
            >
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={"This weekend"} />
              <ListItemSecondaryAction>
                {dayjs().startOf("week").add(6, "day").format("ddd")}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleReschedule(dayjs().add(7, "day").toDate());
                handleClose();
              }}
            >
              <ListItemIcon>
                <NextWeekIcon />
              </ListItemIcon>
              <ListItemText primary={"Next Week"} />
              <ListItemSecondaryAction>
                {dayjs().add(7, "day").format("ddd MMM D")}{" "}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        </List>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            disablePast
            onChange={(date) => {
              handleReschedule(date);
              handleClose();
            }}
          />
        </LocalizationProvider>
      </Popover>
    </div>
  );
}

function TaskListToday({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography>No tasks found.</Typography>
      </Box>
    );
  }

  const overdueTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );
  const todayTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isSame(dayjs(), "day"),
  );

  return (
    <>
      {overdueTasks.length > 0 && (
        <Accordion disableGutters defaultExpanded elevation={0}>
          <AccordionSummary aria-controls="overdue-content" id="overdue-header">
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Typography variant={"h6"} component={"h3"}>
                Overdue
              </Typography>
              <RescheduleDialog tasks={overdueTasks} />
            </Box>
          </AccordionSummary>
          <AccordionDetails id="overdue-content" sx={{ padding: 0 }}>
            <TaskList tasks={overdueTasks} />
          </AccordionDetails>
        </Accordion>
      )}
      {todayTasks.length > 0 && (
        <>
          <Typography mt={3} variant={"h6"} component={"h3"}>
            {dayjs().format("MMM D")} ‧ Today ‧ {dayjs().format("dddd")}
          </Typography>
          <TaskList tasks={todayTasks} />
        </>
      )}
      <AddTodoButton dueDate={dayjs().toDate()} />
    </>
  );
}
export default function TodayPage() {
  const { isPending, isError, data } = useTasksToday();

  const tasks: Task[] = data?.results ?? [];

  return (
    <Box display={"flex"} flexDirection={"column"} height="100vh">
      <Box padding={3} flex="0 1 auto">
        <Typography my={3} variant={"h5"} component={"h2"}>
          Today
        </Typography>
      </Box>
      <Box overflow={"auto"}>
        <Box maxWidth={600} mx={"auto"}>
          {isPending ? (
            <SkeletonList count={5} width={250} />
          ) : isError ? (
            <Alert severity="error">Failed to load tasks</Alert>
          ) : (
            <>
              <TaskListToday tasks={tasks} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
