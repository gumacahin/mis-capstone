# PatchedUserRequest

## Properties

| Name                     | Type                                                         | Description | Notes                             |
| ------------------------ | ------------------------------------------------------------ | ----------- | --------------------------------- |
| **is_faculty**           | **boolean**                                                  |             | [optional] [default to undefined] |
| **is_student**           | **boolean**                                                  |             | [optional] [default to undefined] |
| **is_onboarded**         | **boolean**                                                  |             | [optional] [default to undefined] |
| **projects**             | [**Array&lt;UserProjectRequest&gt;**](UserProjectRequest.md) |             | [optional] [default to undefined] |
| **theme**                | **string**                                                   |             | [optional] [default to undefined] |
| **email_digest_enabled** | **boolean**                                                  |             | [optional] [default to undefined] |

## Example

```typescript
import { PatchedUserRequest } from "./api";

const instance: PatchedUserRequest = {
  is_faculty,
  is_student,
  is_onboarded,
  projects,
  theme,
  email_digest_enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
