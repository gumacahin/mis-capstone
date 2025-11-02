# TaskAdmin


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**dtstart** | **string** |  | [optional] [default to undefined]
**rrule** | **string** |  | [optional] [default to undefined]
**anchor_mode** | **string** |  | [optional] [default to undefined]
**due_date** | **string** |  | [optional] [default to undefined]
**priority** | [**PriorityEnum**](PriorityEnum.md) |  | [optional] [default to undefined]
**tags** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**completion_date** | **string** |  | [optional] [default to undefined]
**order** | **number** |  | [optional] [default to undefined]
**project** | **number** |  | [readonly] [default to undefined]
**created_by** | **number** |  | [readonly] [default to undefined]

## Example

```typescript
import { TaskAdmin } from './api';

const instance: TaskAdmin = {
    id,
    title,
    description,
    dtstart,
    rrule,
    anchor_mode,
    due_date,
    priority,
    tags,
    completion_date,
    order,
    project,
    created_by,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
