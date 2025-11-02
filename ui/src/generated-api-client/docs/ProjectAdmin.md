# ProjectAdmin


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**created_at** | **string** |  | [readonly] [default to undefined]
**updated_at** | **string** |  | [readonly] [default to undefined]
**title** | **string** |  | [default to undefined]
**is_default** | **boolean** |  | [optional] [default to undefined]
**view** | [**ViewEnum**](ViewEnum.md) |  | [optional] [default to undefined]
**order** | **number** |  | [optional] [default to undefined]
**created_by** | **number** |  | [default to undefined]
**updated_by** | **number** |  | [default to undefined]

## Example

```typescript
import { ProjectAdmin } from './api';

const instance: ProjectAdmin = {
    id,
    created_at,
    updated_at,
    title,
    is_default,
    view,
    order,
    created_by,
    updated_by,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
