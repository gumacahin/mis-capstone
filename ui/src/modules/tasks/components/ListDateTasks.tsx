import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import ListProjectSectionCard from "@projects/components/ListProjectSectionCard";
import { Task } from "@shared/types/common";
import dayjs from "dayjs";

import AddTaskButton from "./AddTaskButton";
import ListTaskList from "./ListTaskList";

export interface DateTasksProps {
  date: dayjs.Dayjs;
  tasks: Task[];
  isDragDisabled?: boolean;
}

export default function ListDateTasks({
  date,
  tasks,
  isDragDisabled,
}: DateTasksProps) {
  const isToday = date.isSame(dayjs(), "day");
  const cardTitle = `${date.format("MMM D")} ${isToday ? "‧ Today" : ""} ‧ ${date.format("dddd")}`;
  const taskListId = `datetasks-${date.format("YYYYMMDD")}`;
  return (
    <ListProjectSectionCard>
      <CardHeader
        title={
          <Typography
            sx={{
              textWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            fontWeight={500}
            fontSize={16}
          >
            {cardTitle}
          </Typography>
        }
      />
      <ListTaskList
        tasks={tasks}
        taskListId={taskListId}
        isDragDisabled={isDragDisabled}
        showAddTaskMenuItems={false}
      />
      <CardActions>
        <AddTaskButton presetDueDate={dayjs()} />
      </CardActions>
    </ListProjectSectionCard>
  );
}
