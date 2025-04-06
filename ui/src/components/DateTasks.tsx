import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import { Task } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import TaskList from "./TaskList";

export interface DateTasksProps {
  date: dayjs.Dayjs;
  tasks: Task[];
  isDragDisabled?: boolean;
}

export default function DateTasks({
  date,
  tasks,
  isDragDisabled,
}: DateTasksProps) {
  const isToday = date.isSame(dayjs(), "day");
  const cardTitle = `${date.format("MMM D")} ${isToday ? "‧ Today" : ""} ‧ ${date.format("dddd")}`;
  const taskListId = `datetasks-${date.format("YYYYMMDD")}`;
  return (
    <Card elevation={0}>
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
      <TaskList
        tasks={tasks}
        taskListId={taskListId}
        isDragDisabled={isDragDisabled}
        showAddTaskMenuItems={false}
      />
      <CardActions sx={{ padding: 2 }}>
        <AddTaskButton presetDueDate={dayjs()} />
      </CardActions>
    </Card>
  );
}
