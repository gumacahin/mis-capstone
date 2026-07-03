# PlannerToolDefinition

## Properties

| Name              | Type                        | Description | Notes                  |
| ----------------- | --------------------------- | ----------- | ---------------------- |
| **name**          | **string**                  |             | [default to undefined] |
| **description**   | **string**                  |             | [default to undefined] |
| **input_schema**  | **{ [key: string]: any; }** |             | [default to undefined] |
| **mutates_state** | **boolean**                 |             | [default to undefined] |

## Example

```typescript
import { PlannerToolDefinition } from "./api";

const instance: PlannerToolDefinition = {
  name,
  description,
  input_schema,
  mutates_state,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
