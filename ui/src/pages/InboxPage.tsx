import { useInboxTasks } from "../api";
import TaskList from "../components/TaskList";
import { Alert, Typography } from "@mui/material";
import SkeletonList from "../components/SkeletonList";
import Box from "@mui/material/Box";

export default function InboxPage() {
  const { isPending, isError, data } = useInboxTasks();

  return (
    <>
      <Typography my={3} variant={"h5"} component={"h2"}>
        Inbox
      </Typography>
      <Box maxWidth={600} mx={"auto"}>
        {isError && <Alert severity="error">Ops something went wrong...</Alert>}
        {isPending && <SkeletonList length={10} />}
        {data && <TaskList tasks={data.results} />}
      </Box>
    </>
  );
}
