import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Spinner from "@shared/components/Spinner";
import { useDashboard } from "@shared/hooks/queries";

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboard();

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
        </Grid>
      </CardContent>
    </Card>
  );
}
