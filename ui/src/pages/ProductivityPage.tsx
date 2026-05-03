import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useProductivity } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import ViewPageTitle from "@views/components/ViewPageTitle";
import { useEffect } from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          <Box
            sx={{
              bgcolor: `${color}15`,
              color,
              borderRadius: 2,
              p: 1,
              display: "flex",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TrendBar({
  created,
  completed,
  day,
  maxVal,
}: {
  created: number;
  completed: number;
  day: string;
  maxVal: number;
}) {
  const height = 120;
  const createdH = maxVal > 0 ? (created / maxVal) * height : 0;
  const completedH = maxVal > 0 ? (completed / maxVal) * height : 0;

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" spacing={0.25} alignItems="end" sx={{ height }}>
        <Box
          sx={{
            width: 8,
            height: createdH,
            bgcolor: "primary.light",
            borderRadius: 0.5,
            minHeight: created > 0 ? 4 : 0,
          }}
        />
        <Box
          sx={{
            width: 8,
            height: completedH,
            bgcolor: "success.main",
            borderRadius: 0.5,
            minHeight: completed > 0 ? 4 : 0,
          }}
        />
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: "0.6rem" }}
      >
        {day}
      </Typography>
    </Stack>
  );
}

const PRIORITY_COLORS: Record<string, string> = {
  NONE: "#9e9e9e",
  LOW: "#2196f3",
  MEDIUM: "#ff9800",
  HIGH: "#f44336",
};

export default function ProductivityPage() {
  const { data, isPending, isError } = useProductivity();
  const { setToolbarTitle, setToolbarIcons } = useToolbarContext();

  useEffect(() => {
    setToolbarTitle(<ViewPageTitle title="Productivity" />);
    setToolbarIcons(null);
  }, [setToolbarTitle, setToolbarIcons]);

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Container>
        <Typography color="error" py={4}>
          Failed to load productivity data.
        </Typography>
      </Container>
    );
  }

  const { summary, weekly_trends, priority_distribution, streak } = data;
  const maxTrend = Math.max(
    ...weekly_trends.map((t) => Math.max(t.created, t.completed)),
    1,
  );

  return (
    <Container sx={{ py: 3, overflowY: "auto", height: "100%" }}>
      <Stack spacing={4}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Completion Rate"
              value={`${summary.completion_rate}%`}
              subtitle={`${summary.completed} of ${summary.total} tasks`}
              icon={<TrendingUpIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Streak"
              value={`${streak.current} day${streak.current !== 1 ? "s" : ""}`}
              subtitle="Consecutive days completing tasks"
              icon={<LocalFireDepartmentIcon />}
              color="#ff9800"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Pending"
              value={summary.pending}
              subtitle={`${summary.due_today} due today`}
              icon={<PendingActionsIcon />}
              color="#2196f3"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Overdue"
              value={summary.overdue}
              subtitle={
                summary.avg_completion_days
                  ? `Avg ${summary.avg_completion_days}d to complete`
                  : undefined
              }
              icon={<WarningAmberIcon />}
              color="#f44336"
            />
          </Grid>
        </Grid>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Last 4 Weeks</Typography>
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 0.5,
                        bgcolor: "primary.light",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 0.5,
                        bgcolor: "success.main",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={0} sx={{ overflowX: "auto" }}>
                {weekly_trends.map((t) => (
                  <TrendBar
                    key={t.date}
                    created={t.created}
                    completed={t.completed}
                    day={t.day}
                    maxVal={maxTrend}
                  />
                ))}
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {summary.created_this_week} created this week
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {summary.completed_this_week} completed this week
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">By Priority</Typography>
              {priority_distribution.map((p) => (
                <Stack key={p.priority} spacing={0.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={p.label}
                        size="small"
                        sx={{
                          bgcolor: `${PRIORITY_COLORS[p.priority]}20`,
                          color: PRIORITY_COLORS[p.priority],
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {p.count} task{p.count !== 1 ? "s" : ""}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon
                        sx={{
                          fontSize: 16,
                          color: "success.main",
                        }}
                      />
                      <Typography variant="body2">
                        {p.completion_rate}%
                      </Typography>
                    </Stack>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={p.completion_rate}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: `${PRIORITY_COLORS[p.priority]}15`,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: PRIORITY_COLORS[p.priority],
                        borderRadius: 3,
                      },
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
