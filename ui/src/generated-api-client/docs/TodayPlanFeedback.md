# TodayPlanFeedback

## Properties

| Name                   | Type       | Description | Notes                             |
| ---------------------- | ---------- | ----------- | --------------------------------- |
| **id**                 | **number** |             | [readonly] [default to undefined] |
| **helpfulness_rating** | **number** |             | [default to undefined]            |
| **confidence_rating**  | **number** |             | [default to undefined]            |
| **note**               | **string** |             | [optional] [default to undefined] |
| **created_at**         | **string** |             | [readonly] [default to undefined] |
| **updated_at**         | **string** |             | [readonly] [default to undefined] |

## Example

```typescript
import { TodayPlanFeedback } from "./api";

const instance: TodayPlanFeedback = {
  id,
  helpfulness_rating,
  confidence_rating,
  note,
  created_at,
  updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
