import {
  Draggable,
  type DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
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

const TASK = "TASK";

export interface TaskListProps {
  tasks?: Task[];
  hideDueDates?: boolean;
  isDragging?: boolean;
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

  const hasOpenTask = Boolean(openTask);
  // TODO: fix this
  const taskListId = section?.id.toString()
    ? `tasklist-${section.id}`
    : "some-id";

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
      <CardContent>
        {/* <CardContent sx={{ width: "100%", maxWidth: "332px" }}> */}
        <Droppable droppableId={taskListId} type={TASK}>
          {(provided: DroppableProvided) => (
            <Stack
              minHeight={100}
              spacing={1}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task: Task, index: number) => (
                <Fragment key={task.id}>
                  {addTaskAbove === task.id && (
                    <TaskForm
                      compact={true}
                      taskAbove={addTaskAbove}
                      handleClose={handleCloseAddAboveTaskForm}
                    />
                  )}
                  <Draggable draggableId={`task-${task.id}`} index={index}>
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot,
                    ) => (
                      <TaskCard
                        task={task}
                        handleOpenTask={handleOpenTask}
                        hideDueDates={hideDueDates}
                        handleAddTaskAbove={() => setAddTaskAbove(task.id)}
                        handleAddTaskBelow={() => setAddTaskBelow(task.id)}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    )}
                  </Draggable>
                  {addTaskBelow === task.id && (
                    <TaskForm
                      compact={true}
                      taskBelow={addTaskBelow}
                      handleClose={handleCloseAddBelowTaskForm}
                    />
                  )}
                </Fragment>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </CardContent>
    </>
  );
}
