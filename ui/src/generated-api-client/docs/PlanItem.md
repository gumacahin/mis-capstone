# PlanItem

## Properties

| Name                  | Type                                            | Description | Notes                             |
| --------------------- | ----------------------------------------------- | ----------- | --------------------------------- |
| **id**                | **number**                                      |             | [readonly] [default to undefined] |
| **task**              | [**Task**](Task.md)                             |             | [readonly] [default to undefined] |
| **order**             | **number**                                      |             | [readonly] [default to undefined] |
| **reason**            | **string**                                      |             | [readonly] [default to undefined] |
| **estimated_minutes** | **number**                                      |             | [readonly] [default to undefined] |
| **score**             | **number**                                      |             | [readonly] [default to undefined] |
| **signals**           | [**PlanItemSignals**](PlanItemSignals.md)       |             | [readonly] [default to undefined] |
| **status**            | [**PlanItemStatusEnum**](PlanItemStatusEnum.md) |             | [readonly] [default to undefined] |
| **snoozed_until**     | **string**                                      |             | [readonly] [default to undefined] |
| **accepted_at**       | **string**                                      |             | [readonly] [default to undefined] |
| **dismissed_at**      | **string**                                      |             | [readonly] [default to undefined] |
| **created_at**        | **string**                                      |             | [readonly] [default to undefined] |
| **updated_at**        | **string**                                      |             | [readonly] [default to undefined] |

## Example

```typescript
import { PlanItem } from "./api";

const instance: PlanItem = {
  id,
  task,
  order,
  reason,
  estimated_minutes,
  score,
  signals,
  status,
  snoozed_until,
  accepted_at,
  dismissed_at,
  created_at,
  updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
