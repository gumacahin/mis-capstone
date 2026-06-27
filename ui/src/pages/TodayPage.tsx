import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ListIcon from "@mui/icons-material/List";
import SnoozeIcon from "@mui/icons-material/Snooze";
import TuneIcon from "@mui/icons-material/Tune";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { ProjectViewType, Task } from "@shared";
import SkeletonList from "@shared/components/SkeletonList";
import {
  type PlannerEnergyLevel,
  type PlannerFocusMode,
  type PlannerSuggestion,
  type TodayPlan,
  usePlannerSuggestionAction,
  usePlannerToday,
  useSubmitPlannerCheckIn,
  useTasksToday,
} from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import InboxDefaultSectionProvider from "@views/components/InboxDefaultSectionProvider";
import TodayView from "@views/components/TodayView";
import ViewPageTitle from "@views/components/ViewPageTitle";
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "use-local-storage";

export default function TodayPage() {
  const { isPending, isError, data } = useTasksToday();
  const plannerQuery = usePlannerToday();
  const [view, setView] = useLocalStorage<ProjectViewType>(
    "upoutodo.todayView",
    "list",
  );
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();

  const tasks: Task[] = data?.results ?? [];

  const handleViewChange = useCallback(
    (view: ProjectViewType) => {
      setView(view);
    },
    [setView],
  );

  useEffect(() => {
    setToolbarIcons(
      <ViewMenu
        key="view-menu"
        view={view}
        handleViewChange={handleViewChange}
      />,
    );
    setToolbarTitle(<ViewPageTitle title={"Today"} />);
    return () => {
      setToolbarIcons(null);
      setToolbarTitle(null);
    };
  }, [handleViewChange, setToolbarIcons, setToolbarTitle, view]);

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

  return (
    <InboxDefaultSectionProvider>
      <Stack spacing={3}>
        <PlannerPanel
          isPending={plannerQuery.isPending}
          isError={plannerQuery.isError}
          plan={plannerQuery.data}
        />
        <TodayView view={view} tasks={tasks} />
      </Stack>
    </InboxDefaultSectionProvider>
  );
}

function PlannerPanel({
  isPending,
  isError,
  plan,
}: {
  isPending: boolean;
  isError: boolean;
  plan?: TodayPlan;
}) {
  const submitCheckIn = useSubmitPlannerCheckIn();
  const suggestionAction = usePlannerSuggestionAction();
  const [energyLevel, setEnergyLevel] = useState<PlannerEnergyLevel>("medium");
  const [availableMinutes, setAvailableMinutes] = useState(120);
  const [focusMode, setFocusMode] = useState<PlannerFocusMode>("flexible");
  const [context, setContext] = useState("");

  useEffect(() => {
    if (!plan?.check_in) return;
    setEnergyLevel(plan.check_in.energy_level);
    setAvailableMinutes(plan.check_in.available_minutes);
    setFocusMode(plan.check_in.focus_mode);
    setContext(plan.check_in.context);
  }, [plan?.check_in]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCheckIn.mutate({
      energy_level: energyLevel,
      available_minutes: availableMinutes,
      focus_mode: focusMode,
      context,
    });
  };

  const suggestions =
    plan?.suggestions.filter((item) => item.status !== "dismissed") ?? [];

  if (isError) {
    return (
      <Alert severity="warning">Planner is temporarily unavailable.</Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Typography variant="h6" component="h2" sx={{ minWidth: 120 }}>
              Plan today
            </Typography>
            <TextField
              select
              size="small"
              label="Energy"
              value={energyLevel}
              onChange={(event) => {
                setEnergyLevel(event.target.value as PlannerEnergyLevel);
              }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              size="small"
              label="Minutes"
              type="number"
              value={availableMinutes}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setAvailableMinutes(Number.isNaN(nextValue) ? 0 : nextValue);
              }}
              inputProps={{ min: 0, max: 720 }}
            />
            <TextField
              select
              size="small"
              label="Focus"
              value={focusMode}
              onChange={(event) => {
                setFocusMode(event.target.value as PlannerFocusMode);
              }}
            >
              <MenuItem value="flexible">Flexible</MenuItem>
              <MenuItem value="deep">Deep</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="light">Light</MenuItem>
            </TextField>
            <TextField
              size="small"
              label="Context"
              value={context}
              onChange={(event) => {
                setContext(event.target.value);
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitCheckIn.isPending}
            >
              Update
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="h2">
            Suggested next
          </Typography>
          {isPending && <Chip size="small" label="Loading" />}
        </Stack>
        {suggestions.length === 0 && !isPending && (
          <Alert severity="info">
            No suggestions for the current check-in.
          </Alert>
        )}
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            disabled={suggestionAction.isPending}
            onAction={(action, minutes) => {
              suggestionAction.mutate({
                id: suggestion.id,
                action,
                minutes,
              });
            }}
          />
        ))}
      </Stack>
      <Divider />
    </Stack>
  );
}

function SuggestionCard({
  suggestion,
  disabled,
  onAction,
}: {
  suggestion: PlannerSuggestion;
  disabled: boolean;
  onAction: (action: "accept" | "snooze" | "dismiss", minutes?: number) => void;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
        >
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" component="h3">
                {suggestion.task.title}
              </Typography>
              <Chip size="small" label={suggestion.status} />
              <Chip
                size="small"
                variant="outlined"
                label={`${suggestion.estimated_minutes}m`}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {suggestion.reason}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              startIcon={<CheckCircleOutlineIcon />}
              disabled={disabled || suggestion.status === "accepted"}
              onClick={() => {
                onAction("accept");
              }}
            >
              Accept
            </Button>
            <Button
              size="small"
              startIcon={<SnoozeIcon />}
              disabled={disabled || suggestion.status === "snoozed"}
              onClick={() => {
                onAction("snooze", 60);
              }}
            >
              Snooze
            </Button>
            <Button
              size="small"
              color="inherit"
              startIcon={<CloseIcon />}
              disabled={disabled}
              onClick={() => {
                onAction("dismiss");
              }}
            >
              Dismiss
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

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
        <MenuItem disableRipple>
          <ToggleButtonGroup
            id="view-options-label"
            exclusive
            aria-label="view options"
            aria-labelledby="view-options-label"
            value={view}
            onChange={(_, value) => {
              handleViewChange(value);
              handleClose();
            }}
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
