import {
  DragDropContext,
  type DraggableLocation,
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { Task } from "@shared";
import { useRescheduleTask } from "@shared/hooks/queries";
import ListDateTasks from "@tasks/components/ListDateTasks";
import ListOverdueTasks, {
  OVERDUE_TASK_LIST_ID,
} from "@tasks/components/ListOverdueTasks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

dayjs.extend(utc);

import ListViewContainer from "./ListViewContainer";

export type TodayViewListProps = {
  tasks: Task[];
};

export default function TodayViewList({ tasks }: TodayViewListProps) {
  const { mutateAsync: reschedTask } = useRescheduleTask();
  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
      ),
    [tasks],
  );
  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.due_date &&
          dayjs(task.due_date).utc().format("YYYY-MM-DD") ===
            dayjs().format("YYYY-MM-DD"),
      ),
    [tasks],
  );
  const [overdueTaskList, setOverdueTaskList] = useState<Task[]>(overdueTasks);
  const [todayTaskList, setTodayTaskList] = useState<Task[]>(todayTasks);

  useEffect(() => {
    setOverdueTaskList(overdueTasks);
    setTodayTaskList(todayTasks);
  }, [overdueTasks, todayTasks, setOverdueTaskList, setTodayTaskList]);

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
      <ListViewContainer>
        <ListOverdueTasks overdueTasks={overdueTaskList} />
        <ListDateTasks date={dayjs()} tasks={todayTaskList} isDragDisabled />
      </ListViewContainer>
    </DragDropContext>
  );
}
