import {
  Draggable,
  type DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import CardContent, { type CardContentProps } from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {
  DROPPABLE_MIN_HEIGHT,
  DROPPABLE_TYPE_TASK,
} from "@shared/constants/ui";
import SectionContext from "@shared/contexts/sectionContext";
import useScrollbarWidth from "@shared/hooks/useScrollbarWidth";
import type { Section, Task } from "@shared/types/common";
import { Fragment, memo, useContext, useState } from "react";

import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import UpdateTaskDialog from "./UpdateTaskDialog";

interface InnerListProps {
  tasks: Task[];
  hideDueDates?: boolean;
  hideProject?: boolean;
  isDragDisabled?: boolean;
  showAddTaskMenuItems?: boolean;
  addTaskAbove?: number;
  addTaskBelow?: number;
  setAddTaskAbove: (id: number | undefined) => void;
  setAddTaskBelow: (id: number | undefined) => void;
  handleCloseAddAboveTaskForm: () => void;
  handleCloseAddBelowTaskForm: () => void;
}

const InnerList = memo(function InnerList({
  tasks,
  hideDueDates,
  hideProject,
  isDragDisabled,
  showAddTaskMenuItems,
  addTaskAbove,
  addTaskBelow,
  setAddTaskAbove,
  setAddTaskBelow,
  handleCloseAddAboveTaskForm,
  handleCloseAddBelowTaskForm,
}: InnerListProps) {
  return (
    <>
      {tasks.map((task: Task, index: number) => (
        <Fragment key={task.id}>
          {addTaskAbove === task.id && (
            <TaskForm
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
                hideDueDates={hideDueDates}
                hideProject={hideProject}
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
              taskBelow={addTaskBelow}
              handleClose={handleCloseAddBelowTaskForm}
            />
          )}
        </Fragment>
      ))}
    </>
  );
});

export interface BoardTaskListProps extends CardContentProps {
  tasks?: Task[];
  hideDueDates?: boolean;
  hideProject?: boolean;
  taskListId?: string;
  isDragDisabled?: boolean;
  showAddTaskMenuItems?: boolean;
}

export default function BoardTaskList({
  tasks,
  hideDueDates,
  hideProject,
  taskListId,
  isDragDisabled,
  showAddTaskMenuItems = true,
  ...rest
}: BoardTaskListProps) {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const section = useContext<Section | null>(SectionContext);
  const [addTaskAbove, setAddTaskAbove] = useState<number | undefined>(
    undefined,
  );
  const [addTaskBelow, setAddTaskBelow] = useState<number | undefined>(
    undefined,
  );
  const [hideScrollbar, setHideScrollbar] = useState(true);
  const scrollbarWidth = useScrollbarWidth();
  const isScrollbarAutoHiding = scrollbarWidth === 0;

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
        <UpdateTaskDialog onClose={handleCloseTask} task={openTask!} />
      )}
      <CardContent
        sx={{
          maxHeight: "100%",
          flexGrow: 0,
          overflowY: isScrollbarAutoHiding
            ? "auto"
            : hideScrollbar
              ? "hidden"
              : "auto",
          scrollbarGutter: "stable",
          paddingRight: `${scrollbarWidth - 12}px`,
        }}
        onMouseEnter={() => setHideScrollbar(false)}
        onMouseLeave={() => setHideScrollbar(true)}
        {...rest}
      >
        <Droppable droppableId={droppableId!} type={DROPPABLE_TYPE_TASK}>
          {(provided: DroppableProvided) => (
            <Stack
              minHeight={DROPPABLE_MIN_HEIGHT}
              spacing={1}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <InnerList
                tasks={tasks}
                hideDueDates={hideDueDates}
                hideProject={hideProject}
                isDragDisabled={isDragDisabled}
                showAddTaskMenuItems={showAddTaskMenuItems}
                addTaskAbove={addTaskAbove}
                addTaskBelow={addTaskBelow}
                setAddTaskAbove={setAddTaskAbove}
                setAddTaskBelow={setAddTaskBelow}
                handleCloseAddAboveTaskForm={handleCloseAddAboveTaskForm}
                handleCloseAddBelowTaskForm={handleCloseAddBelowTaskForm}
              />
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </CardContent>
    </>
  );
}
