import React from "react";
import { useTasksToday } from "../api";
import TaskList from "../components/TaskList";
import { Alert, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import SkeletonList from "../components/SkeletonList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Task } from "../types/common";
import dayjs from "dayjs";

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

  const handleReschedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

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
              <Button onClick={handleReschedule} size="small">
                Reschedule
              </Button>
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
    </>
  );
}
export default function TodayPage() {
  const { isPending, isError, data } = useTasksToday();

  return (
    <>
      <Typography my={3} variant={"h5"} component={"h2"}>
        Today
      </Typography>
      <Box maxWidth={600} mx={"auto"}>
        {isError && <Alert severity="error">Ops something went wrong...</Alert>}
        {isPending && <SkeletonList length={10} />}
        {data && <TaskListToday tasks={data.results} />}
      </Box>
    </>
  );
}
