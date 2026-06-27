# PlanItemSignals

## Properties

| Name                  | Type                                  | Description | Notes                  |
| --------------------- | ------------------------------------- | ----------- | ---------------------- |
| **due_date**          | **string**                            |             | [default to undefined] |
| **due_status**        | [**DueStatusEnum**](DueStatusEnum.md) |             | [default to undefined] |
| **due_label**         | **string**                            |             | [default to undefined] |
| **due_in_days**       | **number**                            |             | [default to undefined] |
| **priority**          | **string**                            |             | [default to undefined] |
| **priority_label**    | **string**                            |             | [default to undefined] |
| **estimated_minutes** | **number**                            |             | [default to undefined] |
| **is_recurring**      | **boolean**                           |             | [default to undefined] |
| **project_title**     | **string**                            |             | [default to undefined] |
| **section_title**     | **string**                            |             | [default to undefined] |
| **score**             | **number**                            |             | [default to undefined] |
| **snoozed_count**     | **number**                            |             | [default to undefined] |
| **dismissed_count**   | **number**                            |             | [default to undefined] |

## Example

```typescript
import { PlanItemSignals } from "./api";

const instance: PlanItemSignals = {
  due_date,
  due_status,
  due_label,
  due_in_days,
  priority,
  priority_label,
  estimated_minutes,
  is_recurring,
  project_title,
  section_title,
  score,
  snoozed_count,
  dismissed_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
