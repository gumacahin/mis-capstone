import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import BoardProjectSectionCard from "@projects/components/BoardProjectSectionCard";
import { Task } from "@shared/types/common";
import dayjs from "dayjs";

import AddTaskButton from "./AddTaskButton";
import BoardTaskList from "./BoardTaskList";

export interface DateTasksProps {
  date: dayjs.Dayjs;
  tasks: Task[];
  isDragDisabled?: boolean;
  hideDueDates?: boolean;
}

export default function BoardDateTasks({
  date,
  tasks,
  hideDueDates = false,
  isDragDisabled,
}: DateTasksProps) {
  const isToday = date.isSame(dayjs(), "day");
  const isTomorrow = date.isSame(dayjs().add(1, "day"), "day");
  const cardTitle = `${date.format("MMM D")} ${isToday ? "‧ Today" : isTomorrow ? "‧ Tomorrow" : ""} ‧ ${date.format("dddd")}`;
  const taskListId = `datetasks-${date.format("YYYYMMDD")}`;
  return (
    <BoardProjectSectionCard>
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
            {cardTitle}
          </Typography>
        }
      />
      <BoardTaskList
        tasks={tasks}
        taskListId={taskListId}
        isDragDisabled={isDragDisabled}
        hideDueDates={hideDueDates}
        showAddTaskMenuItems={false}
      />
      <CardActions>
        <AddTaskButton presetDueDate={date} />
      </CardActions>
    </BoardProjectSectionCard>
  );
}
