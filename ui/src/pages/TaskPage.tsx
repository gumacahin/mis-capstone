import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Spinner from "../components/Spinner";
import { useTask } from "../hooks/queries";

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { data: task, isPending, isError } = useTask(Number(taskId), !!taskId);

  useEffect(() => {
    if (task) {
      // Navigate to the project page with state data
      // The ProjectPage will handle opening the task dialog based on the state
      navigate(`/project/${task.project}`, {
        state: { taskId: task.id },
      });
    }
  }, [task, navigate]);

  if (isPending) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner />
      </Box>
    );
  }

  if (isError || !task) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">
          Task not found or you don&apos;t have permission to access it.
        </Alert>
      </Box>
    );
  }

  // This component doesn't render anything visible
  // It just handles the navigation and dialog opening
  return null;
}
