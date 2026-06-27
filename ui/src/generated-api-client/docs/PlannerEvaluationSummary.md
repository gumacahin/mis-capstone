# PlannerEvaluationSummary

## Properties

| Name                           | Type                                                                  | Description | Notes                  |
| ------------------------------ | --------------------------------------------------------------------- | ----------- | ---------------------- |
| **plan_count**                 | **number**                                                            |             | [default to undefined] |
| **feedback_count**             | **number**                                                            |             | [default to undefined] |
| **feedback_response_rate**     | **number**                                                            |             | [default to undefined] |
| **average_helpfulness_rating** | **number**                                                            |             | [default to undefined] |
| **average_confidence_rating**  | **number**                                                            |             | [default to undefined] |
| **total_suggestions**          | **number**                                                            |             | [default to undefined] |
| **suggestion_status_counts**   | [**PlannerSuggestionStatusCounts**](PlannerSuggestionStatusCounts.md) |             | [default to undefined] |
| **suggestion_action_rates**    | [**PlannerSuggestionActionRates**](PlannerSuggestionActionRates.md)   |             | [default to undefined] |

## Example

```typescript
import { PlannerEvaluationSummary } from "./api";

const instance: PlannerEvaluationSummary = {
  plan_count,
  feedback_count,
  feedback_response_rate,
  average_helpfulness_rating,
  average_confidence_rating,
  total_suggestions,
  suggestion_status_counts,
  suggestion_action_rates,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
