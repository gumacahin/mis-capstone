# TodayPlan

## Properties

| Name             | Type                                              | Description | Notes                             |
| ---------------- | ------------------------------------------------- | ----------- | --------------------------------- |
| **id**           | **number**                                        |             | [readonly] [default to undefined] |
| **date**         | **string**                                        |             | [readonly] [default to undefined] |
| **status**       | [**TodayPlanStatusEnum**](TodayPlanStatusEnum.md) |             | [readonly] [default to undefined] |
| **generated_at** | **string**                                        |             | [readonly] [default to undefined] |
| **check_in**     | [**EnergyCheckIn**](EnergyCheckIn.md)             |             | [readonly] [default to undefined] |
| **suggestions**  | [**Array&lt;PlanItem&gt;**](PlanItem.md)          |             | [readonly] [default to undefined] |
| **feedback**     | [**TodayPlanFeedback**](TodayPlanFeedback.md)     |             | [readonly] [default to undefined] |
| **created_at**   | **string**                                        |             | [readonly] [default to undefined] |
| **updated_at**   | **string**                                        |             | [readonly] [default to undefined] |

## Example

```typescript
import { TodayPlan } from "./api";

const instance: TodayPlan = {
  id,
  date,
  status,
  generated_at,
  check_in,
  suggestions,
  feedback,
  created_at,
  updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
