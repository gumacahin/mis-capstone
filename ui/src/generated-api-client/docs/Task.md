# Task


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**dtstart** | **string** |  | [optional] [default to undefined]
**rrule** | **string** |  | [optional] [default to undefined]
**anchor_mode** | **string** |  | [optional] [default to undefined]
**due_date** | **string** |  | [readonly] [default to undefined]
**priority** | [**PriorityEnum**](PriorityEnum.md) |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**completion_date** | **string** |  | [optional] [default to undefined]
**order** | **number** |  | [optional] [default to undefined]
**section** | **number** |  | [default to undefined]
**project** | **number** |  | [readonly] [default to undefined]
**section_title** | **string** |  | [readonly] [default to undefined]
**project_title** | **string** |  | [readonly] [default to undefined]
**comments_count** | **string** |  | [readonly] [default to undefined]

## Example

```typescript
import { Task } from './api';

const instance: Task = {
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
    section,
    project,
    section_title,
    project_title,
    comments_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
