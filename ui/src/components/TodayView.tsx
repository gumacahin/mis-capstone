import { ProjectViewType, Task } from "../types/common";
import TodayViewBoard from "./TodayViewBoard";
import TodayViewList from "./TodayViewList";

export type TodayViewProps = {
  tasks: Task[];
  view: ProjectViewType;
};

export default function TaskView({ tasks, view }: TodayViewProps) {
  return (
    <>
      {view === "list" ? (
        <TodayViewList tasks={tasks} />
      ) : (
        <TodayViewBoard tasks={tasks} />
      )}
    </>
  );
}
