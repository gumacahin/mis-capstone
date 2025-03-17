import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Alert, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

import { useTasksToday } from "../api";
import AddTodoButton from "../components/AddTodoButton";
import RescheduleDialog from "../components/RescheduleDialog";
import SkeletonList from "../components/SkeletonList";
import TaskList from "../components/TaskList";
import type { ITask } from "../types/common";

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

function TaskListToday({ tasks }: { tasks: ITask[] }) {
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

  const tasks: ITask[] = data?.results ?? [];

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
