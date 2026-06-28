# PlannerUiSchema

## Properties

| Name                | Type                                                         | Description | Notes                  |
| ------------------- | ------------------------------------------------------------ | ----------- | ---------------------- |
| **component**       | [**ComponentEnum**](ComponentEnum.md)                        |             | [default to undefined] |
| **mode**            | [**ModeEnum**](ModeEnum.md)                                  |             | [default to undefined] |
| **title**           | **string**                                                   |             | [default to undefined] |
| **message**         | **string**                                                   |             | [default to undefined] |
| **highlights**      | **Array&lt;string&gt;**                                      |             | [default to undefined] |
| **suggestion_ids**  | **Array&lt;number&gt;**                                      |             | [default to undefined] |
| **allowed_actions** | [**Array&lt;AllowedActionsEnum&gt;**](AllowedActionsEnum.md) |             | [default to undefined] |

## Example

```typescript
import { PlannerUiSchema } from "./api";

const instance: PlannerUiSchema = {
  component,
  mode,
  title,
  message,
  highlights,
  suggestion_ids,
  allowed_actions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
