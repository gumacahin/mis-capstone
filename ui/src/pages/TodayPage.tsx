import AddTodoFab from "../components/AddTodoFab";
import { useTasksToday } from "../api";
import TaskList from "../components/TaskList";

export default function TodayPage() {
  const { isPending, isError, data } = useTasksToday();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Ops something went wrong...</div>;
  }

  return <TaskList tasks={data.results} />;
}
