# AdminDashboard

## Properties

| Name                      | Type                                                                       | Description | Notes                  |
| ------------------------- | -------------------------------------------------------------------------- | ----------- | ---------------------- |
| **total_tasks**           | [**AdminMetricTrend**](AdminMetricTrend.md)                                |             | [default to undefined] |
| **active_users**          | [**AdminMetricTrend**](AdminMetricTrend.md)                                |             | [default to undefined] |
| **pending_tasks**         | [**AdminMetricTrend**](AdminMetricTrend.md)                                |             | [default to undefined] |
| **completed_tasks**       | [**AdminMetricTrend**](AdminMetricTrend.md)                                |             | [default to undefined] |
| **weekly_trends**         | [**Array&lt;AdminWeeklyTrend&gt;**](AdminWeeklyTrend.md)                   |             | [default to undefined] |
| **priority_distribution** | [**Array&lt;AdminPriorityDistribution&gt;**](AdminPriorityDistribution.md) |             | [default to undefined] |

## Example

```typescript
import { AdminDashboard } from "./api";

const instance: AdminDashboard = {
  total_tasks,
  active_users,
  pending_tasks,
  completed_tasks,
  weekly_trends,
  priority_distribution,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
