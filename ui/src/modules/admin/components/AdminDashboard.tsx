import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePlannerEvaluationSummary } from "@planner/hooks";
import type { PlannerEvaluationSummary } from "@planner/types";
import Spinner from "@shared/components/Spinner";
import { useDashboard } from "@shared/hooks/queries";

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboard();
  const plannerEvaluation = usePlannerEvaluationSummary();

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Spinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => {
                window.location.reload();
              }}
              color="inherit"
              size="small"
            >
              REFRESH
            </Button>
          }
        >
          Something went wrong. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  const {
    total_tasks,
    active_users,
    pending_tasks,
    completed_tasks,
    weekly_trends,
    priority_distribution,
  } = data;

  interface PriorityDistributionItem {
    priority: "NONE" | "HIGH" | "MEDIUM" | "LOW";
    count: number;
    percent: number;
    completion_rate: number;
    avg_completion_time: number | null;
    overdue_count: number;
  }

  const taskPerformanceData = priority_distribution.map(
    (item: PriorityDistributionItem) => ({
      ...item,
      color: (() => {
        switch (item.priority) {
          case "HIGH":
            return "bg-red-500";
          case "MEDIUM":
            return "bg-yellow-500";
          case "LOW":
            return "bg-green-500";
          default:
            return "bg-gray-500";
        }
      })(),
    }),
  );

  return (
    <Card>
      <CardHeader title="Admin Dashboard" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={3}>
            <Card variant="outlined">
              <CardHeader title="Total Todos" avatar={<CheckCircleIcon />} />
              <CardContent>
                <Typography variant="h5">
                  {total_tasks.total.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                  <Typography variant="body1">
                    <span
                      style={{
                        color:
                          total_tasks.percent_increase < 0 ? "red" : "green",
                      }}
                    >{`${total_tasks.percent_increase}%`}</span>{" "}
                    from last month
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={3}>
            <Card variant="outlined">
              <CardHeader title="Active Users" avatar={<PeopleIcon />} />
              <CardContent>
                <Typography variant="h5">
                  {active_users.total.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                  <Typography variant="body1">
                    <span
                      style={{
                        color:
                          active_users.percent_increase < 0 ? "red" : "green",
                      }}
                    >{`${active_users.percent_increase}%`}</span>{" "}
                    from last month
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={3}>
            <Card variant="outlined">
              <CardHeader title="Pending Tasks" avatar={<AccessTimeIcon />} />
              <CardContent>
                <Typography variant="h5">
                  {pending_tasks.total.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                  <Typography variant="body1">
                    <span
                      style={{
                        color:
                          pending_tasks.percent_increase < 0 ? "red" : "green",
                      }}
                    >{`${pending_tasks.percent_increase}%`}</span>{" "}
                    from last month
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={3}>
            <Card variant="outlined">
              <CardHeader title="Completion Rate" avatar={<TrendingUpIcon />} />
              <CardContent>
                <Typography variant="h5">
                  {completed_tasks.total.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                  <Typography variant="body1">
                    <span
                      style={{
                        color:
                          completed_tasks.percent_increase < 0
                            ? "red"
                            : "green",
                      }}
                    >{`${completed_tasks.percent_increase}%`}</span>{" "}
                    from last month
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card variant="outlined">
              <CardHeader title="Weekly Creation vs Completion" />
              <CardContent>
                <div className="pt-4">
                  <div className="space-y-2">
                    {weekly_trends.map(
                      (day: {
                        day: string;
                        created: number;
                        completed: number;
                      }) => (
                        <div
                          key={day.day}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-xs font-medium w-8">
                            {day.day}
                          </span>
                          <div className="flex-1 flex space-x-1">
                            <div className="flex h-4 bg-gray-100 rounded overflow-hidden flex-1">
                              <div
                                className="bg-blue-500"
                                style={{
                                  width: `${(day.created / 20) * 100}%`,
                                }}
                                title={`${day.created} created`}
                              />
                            </div>
                            <div className="flex h-4 bg-gray-100 rounded overflow-hidden flex-1">
                              <div
                                className="bg-green-500"
                                style={{
                                  width: `${(day.completed / 20) * 100}%`,
                                }}
                                title={`${day.completed} completed`}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground w-16">
                            {day.created}/{day.completed}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Created</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card variant="outlined">
              <CardHeader title="Performance by Priority" />
              <CardContent>
                <div className="space-y-3">
                  {taskPerformanceData.map(
                    (data: PriorityDistributionItem & { color: string }) => (
                      <div key={data.priority} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${data.color}`}
                            />
                            <span className="text-sm font-medium">
                              {data.priority}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {data.count} tasks
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-gray-100 rounded">
                            <div className="font-medium">
                              {data.avg_completion_time ?? "--"}
                            </div>
                            <div className="text-muted-foreground">
                              Avg Time
                            </div>
                          </div>
                          <div className="text-center p-2 bg-gray-100 rounded">
                            <div className="font-medium">
                              {data.completion_rate}%
                            </div>
                            <div className="text-muted-foreground">
                              Complete Rate
                            </div>
                          </div>
                          <div className="text-center p-2 bg-gray-100 rounded">
                            <div className="font-medium text-red-600">
                              {data.overdue_count}
                            </div>
                            <div className="text-muted-foreground">Overdue</div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardHeader
                title="Planner Evaluation"
                avatar={<AssessmentIcon />}
              />
              <CardContent>
                <PlannerEvaluationPanel
                  isError={plannerEvaluation.isError}
                  isLoading={plannerEvaluation.isLoading}
                  summary={plannerEvaluation.data}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

interface PlannerEvaluationPanelProps {
  isError: boolean;
  isLoading: boolean;
  summary?: PlannerEvaluationSummary;
}

function PlannerEvaluationPanel({
  isError,
  isLoading,
  summary,
}: PlannerEvaluationPanelProps) {
  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading planner evaluation...
      </Typography>
    );
  }

  if (isError || !summary) {
    return (
      <Alert severity="warning">
        Planner evaluation metrics are unavailable.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        Aggregate planner evaluation only. These metrics summarize plan
        generation, suggestion actions, and feedback ratings without exposing
        individual task titles or participant notes.
      </Alert>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Chip size="small" label="Capstone evidence" />
        <Chip size="small" variant="outlined" label="Just-in-time planning" />
        <Chip size="small" variant="outlined" label="Anonymized aggregates" />
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Adoption and response
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricBlock
            detail={`${summary.total_suggestions.toLocaleString()} suggestions`}
            evidence="Planner was invoked enough to generate recommendation sets."
            label="Plans generated"
            value={summary.plan_count.toLocaleString()}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricBlock
            detail={`${summary.feedback_count.toLocaleString()} responses`}
            evidence="Participants gave direct feedback on plan usefulness."
            label="Feedback response rate"
            value={formatPercent(summary.feedback_response_rate)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricBlock
            detail="Daily plan usefulness"
            evidence="Higher ratings support the claim that the plan helped."
            label="Avg helpfulness"
            value={formatRating(summary.average_helpfulness_rating)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricBlock
            detail="Confidence after planning"
            evidence="Higher ratings suggest users felt more ready to act."
            label="Avg confidence"
            value={formatRating(summary.average_confidence_rating)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Suggestion action signals
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricBlock
            detail={`${summary.suggestion_status_counts.accepted.toLocaleString()} suggestions`}
            evidence="Accepted suggestions indicate the recommendation matched immediate intent."
            label="Accepted"
            value={formatPercent(summary.suggestion_action_rates.accepted)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricBlock
            detail={`${summary.suggestion_status_counts.snoozed.toLocaleString()} suggestions`}
            evidence="Snoozes show partial fit: relevant, but not right now."
            label="Snoozed"
            value={formatPercent(summary.suggestion_action_rates.snoozed)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricBlock
            detail={`${summary.suggestion_status_counts.dismissed.toLocaleString()} suggestions`}
            evidence="Dismissals identify recommendation misses for iteration."
            label="Dismissed"
            value={formatPercent(summary.suggestion_action_rates.dismissed)}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

interface MetricBlockProps {
  detail: string;
  evidence: string;
  label: string;
  value: string;
}

function MetricBlock({ detail, evidence, label, value }: MetricBlockProps) {
  return (
    <Box
      sx={{
        bgcolor: "grey.100",
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        height: "100%",
        p: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {detail}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Evidence: {evidence}
      </Typography>
    </Box>
  );
}

const formatPercent = (value: number) => `${formatNumber(value)}%`;

const formatRating = (value: number | null) =>
  value === null ? "No data" : `${formatNumber(value)} / 5`;

const formatNumber = (value: number) =>
  value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  });
