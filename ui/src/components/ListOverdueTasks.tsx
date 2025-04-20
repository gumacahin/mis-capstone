import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import CardHeader from "@mui/material/CardHeader";
import Portal from "@mui/material/Portal";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";

import { Task } from "../types/common";
import ListProjectSectionCard from "./ListProjectSectionCard";
import ListTaskList from "./ListTaskList";
import RescheduleDialog from "./RescheduleDialog";

export const OVERDUE_TASK_LIST_ID = "overdue-tasks";

const ListOverdueTasks = forwardRef<
  HTMLDivElement,
  {
    overdueTasks: Task[];
    headerRef?: React.RefObject<HTMLDivElement | null> | null;
  }
>(({ overdueTasks, headerRef }, ref) => {
  if (overdueTasks.length === 0) {
    return null;
  }
  const cardHeader = (
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
      action={<RescheduleDialog tasks={overdueTasks} />}
    />
  );
  return (
    <ListProjectSectionCard
      component={Accordion}
      // FIXME: Why is this not valid when defaultExpanded is (both from Accordion)?
      disableGutters
      defaultExpanded
      elevation={0}
      data-id="overdue"
      ref={ref}
    >
      {headerRef?.current ? (
        <Portal container={() => headerRef.current || null}>
          {cardHeader}
        </Portal>
      ) : (
        cardHeader
      )}
      <ListTaskList
        tasks={overdueTasks}
        taskListId={OVERDUE_TASK_LIST_ID}
        showAddTaskMenuItems={false}
        component={AccordionDetails}
        id="overdue-content"
      />
    </ListProjectSectionCard>
  );
});
ListOverdueTasks.displayName = "ListOverdueTasks";
export default ListOverdueTasks;

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
