import {
  Draggable,
  type DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import CardContent, { type CardContentProps } from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Fragment, useContext, useState } from "react";

import { DROPPABLE_MIN_HEIGHT, DROPPABLE_TYPE_TASK } from "../constants/ui";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import type { ProjectDetail, Section, Task } from "../types/common";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import UpdateTaskDialog from "./UpdateTaskDialog";

export interface TaskListProps extends CardContentProps {
  tasks?: Task[];
  hideDueDates?: boolean;
  taskListId?: string;
  isDragDisabled?: boolean;
  showAddTaskMenuItems?: boolean;
}

export default function ListTaskList({
  tasks,
  hideDueDates,
  taskListId,
  isDragDisabled,
  showAddTaskMenuItems = true,
  ...rest
}: TaskListProps) {
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

  const droppableId = taskListId ? taskListId : `tasklist-${section?.id}`;

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
      <CardContent {...rest}>
        <Droppable droppableId={droppableId!} type={DROPPABLE_TYPE_TASK}>
          {(provided: DroppableProvided) => (
            <Stack
              minHeight={DROPPABLE_MIN_HEIGHT}
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
                  <Draggable
                    isDragDisabled={isDragDisabled}
                    draggableId={`task-${task.id}`}
                    index={index}
                  >
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
                        showAddTaskMenuItems={showAddTaskMenuItems}
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
