import { DragDropContext, type DraggableLocation } from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useRescheduleTask } from "../api";
import { Task } from "../types/common";
import DateTasks from "./DateTasks";
import OverdueTasks, { OVERDUE_TASK_LIST_ID } from "./OverdueTasks";

export type TodayViewListProps = {
  tasks: Task[];
};

export default function TodayViewList({ tasks }: TodayViewListProps) {
  const MAX_WIDTH = 800;
  const { mutateAsync: reschedTask } = useRescheduleTask();
  const overdueTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );
  const todayTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isSame(dayjs(), "day"),
  );
  const [overdueTaskList, setOverdueTaskList] = useState<Task[]>(overdueTasks);
  const [todayTaskList, setTodayTaskList] = useState<Task[]>(todayTasks);

  const handleDragEnd = async ({
    destination,
    source,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination || destination.droppableId === OVERDUE_TASK_LIST_ID) {
      return;
    }

    const newOverdueTaskList = Array.from(overdueTaskList);
    const newTodayTaskList = Array.from(todayTaskList);
    const [removed] = newOverdueTaskList.splice(source.index, 1);
    removed.due_date = dayjs().format("YYYY-MM-DD");
    newTodayTaskList.splice(destination.index, 0, removed);

    setOverdueTaskList(newOverdueTaskList);
    setTodayTaskList(newTodayTaskList);

    await toast.promise(
      reschedTask({
        task: removed,
        dueDate: dayjs(),
      }),
      {
        loading: "Rescheduling task...",
        error: "Failed to reschedule task.",
        success: "Task rescheduled successfully!",
      },
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box maxWidth={MAX_WIDTH} mx={"auto"}>
        <OverdueTasks overdueTasks={overdueTaskList} />
        <DateTasks date={dayjs()} tasks={todayTaskList} isDragDisabled />
      </Box>
    </DragDropContext>
  );
}
