import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TagDetail } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import BoardProjectSectionCard from "./BoardProjectSectionCard";
import BoardViewContainer from "./BoardViewContainer";
import LabelViewBoardTaskList from "./LabelViewBoardTaskList";
import LabelViewNoTasks from "./LabelViewNoTasks";

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
        <Stack>
          <AddTaskButton presetLabel={label.name} />
          <LabelViewNoTasks labelName={label.name} />
        </Stack>
      )}
    </BoardViewContainer>
  );
}
