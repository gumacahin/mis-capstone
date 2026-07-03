# ProjectDetail

## Properties

| Name           | Type                                                 | Description | Notes                             |
| -------------- | ---------------------------------------------------- | ----------- | --------------------------------- |
| **id**         | **number**                                           |             | [readonly] [default to undefined] |
| **is_default** | **boolean**                                          |             | [optional] [default to undefined] |
| **title**      | **string**                                           |             | [default to undefined]            |
| **view**       | [**ViewEnum**](ViewEnum.md)                          |             | [optional] [default to undefined] |
| **order**      | **number**                                           |             | [optional] [default to undefined] |
| **sections**   | [**Array&lt;ProjectSection&gt;**](ProjectSection.md) |             | [readonly] [default to undefined] |

## Example

```typescript
import { ProjectDetail } from "./api";

const instance: ProjectDetail = {
  id,
  is_default,
  title,
  view,
  order,
  sections,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
