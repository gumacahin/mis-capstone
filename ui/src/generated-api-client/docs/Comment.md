# Comment

## Properties

| Name            | Type       | Description | Notes                             |
| --------------- | ---------- | ----------- | --------------------------------- |
| **id**          | **number** |             | [readonly] [default to undefined] |
| **object_pk**   | **string** |             | [default to undefined]            |
| **user**        | **number** |             | [readonly] [default to undefined] |
| **user_name**   | **string** |             | [readonly] [default to undefined] |
| **comment**     | **string** |             | [default to undefined]            |
| **submit_date** | **string** |             | [readonly] [default to undefined] |

## Example

```typescript
import { Comment } from "./api";

const instance: Comment = {
  id,
  object_pk,
  user,
  user_name,
  comment,
  submit_date,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
