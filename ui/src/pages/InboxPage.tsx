import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { useInboxTasks } from "../api";
import AddTodoButton from "../components/AddTodoButton";
import SkeletonList from "../components/SkeletonList";
import TaskList from "../components/TaskList";
import type { ITask } from "../types/common";

export default function InboxPage() {
  const { isPending, isError, data } = useInboxTasks();
  const tasks: ITask[] = data?.results ?? [];
  return (
    <Box display={"flex"} flexDirection={"column"} height="100vh">
      <Box padding={3} flex="0 1 auto">
        <Typography my={3} variant={"h5"} component={"h2"}>
          Inbox
        </Typography>
      </Box>
      <Box
        sx={{
          flex: "1 1 auto",
          width: "100%",
          overflowX: "auto",
          paddingX: 3,
        }}
      >
        <Box overflow={"auto"}>
          <Box maxWidth={600} mx={"auto"}>
            {isPending ? (
              <SkeletonList count={5} width={250} />
            ) : isError ? (
              <Alert severity="error">Failed to load tasks</Alert>
            ) : (
              <>
                <TaskList tasks={tasks} />
                <AddTodoButton />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
