import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BoardProjectSectionCard from "@projects/components/BoardProjectSectionCard";
import { TagDetail } from "@shared/types/common";
import AddTaskButton from "@tasks/components/AddTaskButton";
import LabelViewBoardTaskList from "@tasks/components/LabelViewBoardTaskList";
import LabelViewNoTasks from "@tasks/components/LabelViewNoTasks";

import BoardViewContainer from "./BoardViewContainer";

export type LabelViewBoardProps = {
  label: TagDetail;
};

export default function LabelViewBoard({ label }: LabelViewBoardProps) {
  const hasTasks = label.tasks.length !== 0;
  return (
    <BoardViewContainer>
      {hasTasks ? (
        <BoardProjectSectionCard>
          <CardHeader
            sx={{ "MuiCardHeader-root": { padding: 0 } }}
            title={<Typography fontSize="16">(No Section)</Typography>}
          />
          <LabelViewBoardTaskList tasks={label.tasks} />
          <CardActions>
            <AddTaskButton presetLabel={label.name} />
          </CardActions>
        </BoardProjectSectionCard>
      ) : (
        <Stack mx={2} spacing={2}>
          <AddTaskButton presetLabel={label.name} />
          <LabelViewNoTasks labelName={label.name} />
        </Stack>
      )}
    </BoardViewContainer>
  );
}
