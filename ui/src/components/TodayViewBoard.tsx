import { DragDropContext, type DraggableLocation } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useRescheduleTask } from "../hooks/queries";
import { Task } from "../types/common";
import BoardDateTasks from "./BoardDateTasks";
import BoardOverdueTasks, { OVERDUE_TASK_LIST_ID } from "./BoardOverdueTasks";
import BoardViewContainer from "./BoardViewContainer";

export type TodayViewListProps = {
  tasks: Task[];
};

export default function TodayViewList({ tasks }: TodayViewListProps) {
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
      <BoardViewContainer>
        <BoardOverdueTasks overdueTasks={overdueTasks} />
        <BoardDateTasks date={dayjs()} tasks={todayTasks} isDragDisabled />
      </BoardViewContainer>
    </DragDropContext>
  );
}
