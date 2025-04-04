import {
  Draggable,
  type DraggableProvided,
  Droppable,
} from "@hello-pangea/dnd";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Fragment, useContext, useState } from "react";

import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import type { ProjectDetail, Section, Task } from "../types/common";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import UpdateTaskDialog from "./UpdateTaskDialog";

export interface TaskListProps {
  tasks?: Task[];
  hideDueDates?: boolean;
}

export default function TaskList({ tasks, hideDueDates }: TaskListProps) {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const section = useContext<Section | null>(SectionContext);
  const project = useContext<ProjectDetail | null>(ProjectContext)!;
  const [addTaskAbove, setAddTaskAbove] = useState<number | undefined>(
    undefined,
  );
  const [addTaskBelow, setAddTaskBelow] = useState<number | undefined>(
    undefined,
  );

  const handleOpenTask = (taskId: number) => {
    setOpenTaskId(taskId);
  };
  const handleCloseTask = () => {
    setOpenTaskId(null);
  };
  const handleCloseAddAboveTaskForm = () => {
    setAddTaskAbove(undefined);
  };
  const handleCloseAddBelowTaskForm = () => {
    setAddTaskBelow(undefined);
  };

  tasks = tasks ?? section?.tasks ?? [];
  const openTask = tasks.find((task: Task) => task.id === openTaskId);

  const hasTasks = tasks.length > 0;
  const hasOpenTask = Boolean(openTask);
  // TODO: fix this
  const taskListId = section?.id ?? "some-id";

  return (
    <>
      {hasOpenTask && (
        <UpdateTaskDialog
          open={hasOpenTask}
          handleClose={handleCloseTask}
          task={openTask!}
          project={project}
        />
      )}
      {hasTasks && (
        <CardContent sx={{ width: "100%", maxWidth: "332px" }}>
          <Stack component={"div"} spacing={1}>
            {tasks.map((task: Task, index: number) => (
              <Fragment key={task.id}>
                {addTaskAbove === task.id && (
                  <TaskForm
                    compact={true}
                    taskAbove={addTaskAbove}
                    handleClose={handleCloseAddAboveTaskForm}
                  />
                )}
                <TaskCard
                  task={task}
                  handleOpenTask={handleOpenTask}
                  hideDueDates={hideDueDates}
                  handleAddTaskAbove={() => setAddTaskAbove(task.id)}
                  handleAddTaskBelow={() => setAddTaskBelow(task.id)}
                />
                {addTaskBelow === task.id && (
                  <TaskForm
                    compact={true}
                    taskBelow={addTaskBelow}
                    handleClose={handleCloseAddBelowTaskForm}
                  />
                )}
              </Fragment>
            ))}
          </Stack>
        </CardContent>
      )}
    </>
  );
}
