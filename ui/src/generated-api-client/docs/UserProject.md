# UserProject

## Properties

| Name           | Type                                                         | Description | Notes                             |
| -------------- | ------------------------------------------------------------ | ----------- | --------------------------------- |
| **id**         | **number**                                                   |             | [readonly] [default to undefined] |
| **title**      | **string**                                                   |             | [default to undefined]            |
| **sections**   | [**Array&lt;UserProjectSection&gt;**](UserProjectSection.md) |             | [default to undefined]            |
| **is_default** | **boolean**                                                  |             | [readonly] [default to undefined] |

## Example

```typescript
import { UserProject } from "./api";

const instance: UserProject = {
  id,
  title,
  sections,
  is_default,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
