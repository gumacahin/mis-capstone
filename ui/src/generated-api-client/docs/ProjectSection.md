# ProjectSection

## Properties

| Name           | Type                             | Description | Notes                             |
| -------------- | -------------------------------- | ----------- | --------------------------------- |
| **id**         | **number**                       |             | [readonly] [default to undefined] |
| **project**    | **number**                       |             | [default to undefined]            |
| **title**      | **string**                       |             | [default to undefined]            |
| **order**      | **number**                       |             | [optional] [default to undefined] |
| **tasks**      | [**Array&lt;Task&gt;**](Task.md) |             | [readonly] [default to undefined] |
| **is_default** | **boolean**                      |             | [optional] [default to undefined] |

## Example

```typescript
import { ProjectSection } from "./api";

const instance: ProjectSection = {
  id,
  project,
  title,
  order,
  tasks,
  is_default,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
