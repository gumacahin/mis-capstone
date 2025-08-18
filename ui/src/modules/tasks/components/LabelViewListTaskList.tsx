import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent, { type CardContentProps } from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { TagDetail, Task } from "@shared/types/common";
import { Fragment } from "react";

import AddTaskButton from "./AddTaskButton";
import LabelViewNoTasks from "./LabelViewNoTasks";
import LabelViewTaskCard from "./LabelViewTaskCard";

export interface LabelViewListTaskListProps extends CardContentProps {
  label: TagDetail;
  hideDueDates?: boolean;
  taskListId?: string;
  showAddTaskMenuItems?: boolean;
}

export default function LabelViewListTaskList({
  label,
  hideDueDates,
  showAddTaskMenuItems = true,
  ...rest
}: LabelViewListTaskListProps) {
  const noTasks = label.tasks.length === 0;
  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          height: "auto",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: "0 0 auto",
        }}
      >
        <CardContent {...rest}>
          <Stack spacing={1}>
            {label.tasks.map((task: Task) => (
              <Fragment key={task.id}>
                <LabelViewTaskCard
                  task={task}
                  hideDueDates={hideDueDates}
                  showAddTaskMenuItems={showAddTaskMenuItems}
                />
              </Fragment>
            ))}
          </Stack>
        </CardContent>
        <CardActions>
          <AddTaskButton presetLabel={label.name} />
        </CardActions>
      </Card>
      {noTasks && <LabelViewNoTasks labelName={label.name} />}
    </>
  );
}
