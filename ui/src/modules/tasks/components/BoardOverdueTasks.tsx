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
import BoardProjectSectionCard from "@projects/components/BoardProjectSectionCard";
import { Task } from "@shared/types/common";
import { forwardRef } from "react";

import BoardTaskList from "./BoardTaskList";
import RescheduleDialog from "./RescheduleDialog";

export const OVERDUE_TASK_LIST_ID = "overdue-tasks";

const BoardOverdueTasks = forwardRef<
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
    <BoardProjectSectionCard
      component={Accordion}
      // FIXME: Why is this not valid when defaultExpanded is (both from Accordion)?
      // @ts-expect-error - disableGutters is not a valid prop for CardProps
      disableGutters
      defaultExpanded
      elevation={0}
      data-id="overdue"
      ref={ref}
      sx={{
        "& .MuiCollapse-root": {
          height: "100%",
        },
        "& .MuiCollapse-wrapper": {
          height: "100%",
        },
        "& .MuiAccordion-region": {
          height: "100%",
        },
      }}
    >
      {headerRef?.current ? (
        <Portal container={() => headerRef.current || null}>
          {cardHeader}
        </Portal>
      ) : (
        cardHeader
      )}
      <BoardTaskList
        tasks={overdueTasks}
        taskListId={OVERDUE_TASK_LIST_ID}
        showAddTaskMenuItems={false}
        component={AccordionDetails}
        id="overdue-content"
      />
    </BoardProjectSectionCard>
  );
});
BoardOverdueTasks.displayName = "BoardOverdueTasks";
export default BoardOverdueTasks;

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
