# PlannerToolInvocationResult

## Properties

| Name            | Type                                    | Description | Notes                  |
| --------------- | --------------------------------------- | ----------- | ---------------------- |
| **tool_name**   | **string**                              |             | [default to undefined] |
| **result_type** | [**ResultTypeEnum**](ResultTypeEnum.md) |             | [default to undefined] |
| **result**      | **{ [key: string]: any; }**             |             | [default to undefined] |

## Example

```typescript
import { PlannerToolInvocationResult } from "./api";

const instance: PlannerToolInvocationResult = {
  tool_name,
  result_type,
  result,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
