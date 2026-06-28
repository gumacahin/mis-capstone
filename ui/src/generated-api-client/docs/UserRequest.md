# UserRequest

## Properties

| Name                     | Type                                                         | Description | Notes                  |
| ------------------------ | ------------------------------------------------------------ | ----------- | ---------------------- |
| **is_faculty**           | **boolean**                                                  |             | [default to undefined] |
| **is_student**           | **boolean**                                                  |             | [default to undefined] |
| **is_onboarded**         | **boolean**                                                  |             | [default to undefined] |
| **projects**             | [**Array&lt;UserProjectRequest&gt;**](UserProjectRequest.md) |             | [default to undefined] |
| **theme**                | **string**                                                   |             | [default to undefined] |
| **email_digest_enabled** | **boolean**                                                  |             | [default to undefined] |

## Example

```typescript
import { UserRequest } from "./api";

const instance: UserRequest = {
  is_faculty,
  is_student,
  is_onboarded,
  projects,
  theme,
  email_digest_enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
