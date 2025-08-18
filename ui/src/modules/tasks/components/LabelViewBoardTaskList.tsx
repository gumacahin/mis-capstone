import CardContent, { type CardContentProps } from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import SectionContext from "@shared/contexts/sectionContext";
import useScrollbarWidth from "@shared/hooks/useScrollbarWidth";
import type { Section, Task } from "@shared/types/common";
import { useContext, useState } from "react";

import LabelViewTaskCard from "./LabelViewTaskCard";
import UpdateTaskDialog from "./UpdateTaskDialog";

export interface LabelViewBoardTaskListProps extends CardContentProps {
  tasks?: Task[];
  hideDueDates?: boolean;
  taskListId?: string;
  isDragDisabled?: boolean;
  showAddTaskMenuItems?: boolean;
}

export default function LabelViewBoardTaskList({
  tasks,
  hideDueDates,
  showAddTaskMenuItems = true,
  ...rest
}: LabelViewBoardTaskListProps) {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const section = useContext<Section | null>(SectionContext);
  const [hideScrollbar, setHideScrollbar] = useState(true);
  const scrollbarWidth = useScrollbarWidth();
  const isScrollbarAutoHiding = scrollbarWidth === 0;

  const handleCloseTask = () => {
    setOpenTaskId(null);
  };

  tasks = tasks ?? section?.tasks ?? [];
  const openTask = tasks.find((task: Task) => task.id === openTaskId);

  const hasOpenTask = Boolean(openTask);

  return (
    <>
      {hasOpenTask && (
        <UpdateTaskDialog task={openTask!} onClose={handleCloseTask} />
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
        <Stack spacing={1}>
          {tasks.map((task: Task) => (
            <LabelViewTaskCard
              key={task.id}
              task={task}
              hideDueDates={hideDueDates}
              showAddTaskMenuItems={showAddTaskMenuItems}
            />
          ))}
        </Stack>
      </CardContent>
    </>
  );
}
