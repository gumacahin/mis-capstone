# TaskRequest

## Properties

| Name                | Type                                | Description | Notes                             |
| ------------------- | ----------------------------------- | ----------- | --------------------------------- |
| **title**           | **string**                          |             | [default to undefined]            |
| **description**     | **string**                          |             | [optional] [default to undefined] |
| **dtstart**         | **string**                          |             | [optional] [default to undefined] |
| **rrule**           | **string**                          |             | [optional] [default to undefined] |
| **anchor_mode**     | **string**                          |             | [optional] [default to undefined] |
| **priority**        | [**PriorityEnum**](PriorityEnum.md) |             | [optional] [default to undefined] |
| **tags**            | **Array&lt;string&gt;**             |             | [optional] [default to undefined] |
| **completion_date** | **string**                          |             | [optional] [default to undefined] |
| **order**           | **number**                          |             | [optional] [default to undefined] |
| **section**         | **number**                          |             | [default to undefined]            |
| **above_task**      | **number**                          |             | [optional] [default to undefined] |
| **below_task**      | **number**                          |             | [optional] [default to undefined] |
| **source_section**  | **number**                          |             | [optional] [default to undefined] |

## Example

```typescript
import { TaskRequest } from "./api";

const instance: TaskRequest = {
  title,
  description,
  dtstart,
  rrule,
  anchor_mode,
  priority,
  tags,
  completion_date,
  order,
  section,
  above_task,
  below_task,
  source_section,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
