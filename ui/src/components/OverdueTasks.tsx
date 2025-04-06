import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { Task } from "../types/common";
import RescheduleDialog from "./RescheduleDialog";
import TaskList from "./TaskList";

export const OVERDUE_TASK_LIST_ID = "overdue-tasks";

export default function OverdueTasks({
  overdueTasks,
}: {
  overdueTasks: Task[];
}) {
  if (overdueTasks.length === 0) {
    return null;
  }
  return (
    <Card component={Accordion} disableGutters defaultExpanded elevation={0}>
      <CardHeader
        title={
          <Typography
            sx={{
              flexShrink: 1,
              textWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            fontWeight={500}
            fontSize={16}
          >
            Overdue
          </Typography>
        }
        component={AccordionSummary}
        aria-controls="overdue-content"
        id="overdue-header"
        action={<RescheduleDialog tasks={overdueTasks} />}
      ></CardHeader>
      <CardContent
        component={AccordionDetails}
        id="overdue-content"
        sx={{ padding: 0 }}
      >
        <TaskList
          tasks={overdueTasks}
          taskListId={OVERDUE_TASK_LIST_ID}
          showAddTaskMenuItems={false}
        />
      </CardContent>
    </Card>
  );
}

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
