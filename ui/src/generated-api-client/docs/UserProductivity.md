# UserProductivity

## Properties

| Name                      | Type                                                                                     | Description | Notes                  |
| ------------------------- | ---------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| **summary**               | [**ProductivitySummary**](ProductivitySummary.md)                                        |             | [default to undefined] |
| **weekly_trends**         | [**Array&lt;ProductivityWeeklyTrend&gt;**](ProductivityWeeklyTrend.md)                   |             | [default to undefined] |
| **priority_distribution** | [**Array&lt;ProductivityPriorityDistribution&gt;**](ProductivityPriorityDistribution.md) |             | [default to undefined] |
| **streak**                | [**ProductivityStreak**](ProductivityStreak.md)                                          |             | [default to undefined] |

## Example

```typescript
import { UserProductivity } from "./api";

const instance: UserProductivity = {
  summary,
  weekly_trends,
  priority_distribution,
  streak,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
