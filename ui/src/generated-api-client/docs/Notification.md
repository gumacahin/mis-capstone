# Notification

## Properties

| Name           | Type                        | Description | Notes                             |
| -------------- | --------------------------- | ----------- | --------------------------------- |
| **id**         | **number**                  |             | [readonly] [default to undefined] |
| **type**       | [**TypeEnum**](TypeEnum.md) |             | [readonly] [default to undefined] |
| **title**      | **string**                  |             | [readonly] [default to undefined] |
| **message**    | **string**                  |             | [readonly] [default to undefined] |
| **is_read**    | **boolean**                 |             | [optional] [default to undefined] |
| **task**       | **number**                  |             | [readonly] [default to undefined] |
| **created_at** | **string**                  |             | [readonly] [default to undefined] |

## Example

```typescript
import { Notification } from "./api";

const instance: Notification = {
  id,
  type,
  title,
  message,
  is_read,
  task,
  created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
