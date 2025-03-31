import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ListIcon from "@mui/icons-material/List";
import TuneIcon from "@mui/icons-material/Tune";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { Alert, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";
import useLocalStorage from "use-local-storage";

import { useTasksToday } from "../api";
import AddTaskButton from "../components/AddTaskButton";
import InboxDefaultSectionProvider from "../components/InboxDefaultSectionProvider";
import RescheduleDialog from "../components/RescheduleDialog";
import SkeletonList from "../components/SkeletonList";
import TaskList from "../components/TaskList";
import type { ITask, ProjectViewType } from "../types/common";

function ViewMenu({
  view,
  handleViewChange,
}: {
  view: ProjectViewType;
  handleViewChange: (view: ProjectViewType) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="view-menu-button"
        aria-controls={open ? "view-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<TuneIcon />}
      >
        View
      </Button>
      <Menu
        id="view-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "view-menu-button",
        }}
      >
        <MenuItem>
          <ToggleButtonGroup
            id="view-options-label"
            exclusive
            aria-label="view options"
            aria-labelledby="view-options-label"
            value={view}
            onChange={() => handleViewChange(view)}
          >
            <ToggleButton
              value="list"
              aria-label="list view"
              disabled={view === "list"}
            >
              <Stack alignItems={"center"}>
                <ListIcon />
                <small>List</small>
              </Stack>
            </ToggleButton>
            <ToggleButton
              value="board"
              aria-label="board view"
              disabled={view === "board"}
            >
              <Stack alignItems={"center"}>
                <ViewModuleIcon />
                <small>Board</small>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
      </Menu>
    </>
  );
}

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: 0,
  margin: 0,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
}));

function TaskListToday({
  tasks,
  view,
}: {
  tasks: ITask[];
  view: ProjectViewType;
}) {
  const overdueTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );
  const todayTasks = tasks.filter(
    (task) => task.due_date && dayjs(task.due_date).isSame(dayjs(), "day"),
  );

  if (view === "list") {
    return (
      <>
        {overdueTasks.length > 0 && (
          <Accordion disableGutters defaultExpanded elevation={0}>
            <AccordionSummary
              aria-controls="overdue-content"
              id="overdue-header"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Typography variant={"h6"} component={"h3"}>
                  Overdue
                </Typography>
                <RescheduleDialog tasks={overdueTasks} />
              </Box>
            </AccordionSummary>
            <AccordionDetails id="overdue-content" sx={{ padding: 0 }}>
              <TaskList tasks={overdueTasks} />
            </AccordionDetails>
          </Accordion>
        )}
        {todayTasks.length > 0 && (
          <>
            <Typography mt={3} variant={"h6"} component={"h3"}>
              {dayjs().format("MMM D")} ‧ Today ‧ {dayjs().format("dddd")}
            </Typography>
            <TaskList tasks={todayTasks} />
          </>
        )}
        <AddTaskButton presetDueDate={dayjs()} />
      </>
    );
  }

  if (view === "board") {
    return "board";
  }

  return null;
}

export default function TodayPage() {
  const { isPending, isError, data } = useTasksToday();
  const [view, setView] = useLocalStorage<ProjectViewType>("todayView", "list");

  const tasks: ITask[] = data?.results ?? [];

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Alert severity="error">Failed to load tasks</Alert>
      </Box>
    );
  }

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <SkeletonList count={10} />
      </Box>
    );
  }

  const handleViewChange = (view: ProjectViewType) => {
    setView(view);
  };

  return (
    <>
      <Stack
        position={"relative"}
        zIndex={999}
        mt={-9}
        spacing={1}
        padding={3}
        direction="row"
        justifyContent="end"
      >
        <ViewMenu view={view} handleViewChange={handleViewChange} />
      </Stack>
      <Box display={"flex"} flexDirection={"column"} height="100vh">
        <Box padding={3} flex="0 1 auto">
          <Typography my={3} variant={"h5"} component={"h2"}>
            Today
          </Typography>
        </Box>
        <Box overflow={"auto"}>
          <Box maxWidth={600} mx={"auto"}>
            <InboxDefaultSectionProvider>
              <TaskListToday view={view} tasks={tasks} />
            </InboxDefaultSectionProvider>
          </Box>
        </Box>
      </Box>
    </>
  );
}
