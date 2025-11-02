# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**name** | **string** |  | [readonly] [default to undefined]
**email** | **string** |  | [readonly] [default to undefined]
**is_faculty** | **boolean** |  | [default to undefined]
**is_student** | **boolean** |  | [default to undefined]
**is_onboarded** | **boolean** |  | [default to undefined]
**projects** | [**Array&lt;Project&gt;**](Project.md) |  | [default to undefined]
**theme** | **string** |  | [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    id,
    name,
    email,
    is_faculty,
    is_student,
    is_onboarded,
    projects,
    theme,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
