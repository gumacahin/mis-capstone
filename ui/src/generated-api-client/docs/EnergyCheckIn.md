# EnergyCheckIn

## Properties

| Name                  | Type                                      | Description | Notes                             |
| --------------------- | ----------------------------------------- | ----------- | --------------------------------- |
| **id**                | **number**                                |             | [readonly] [default to undefined] |
| **date**              | **string**                                |             | [readonly] [default to undefined] |
| **energy_level**      | [**EnergyLevelEnum**](EnergyLevelEnum.md) |             | [optional] [default to undefined] |
| **available_minutes** | **number**                                |             | [optional] [default to undefined] |
| **focus_mode**        | [**FocusModeEnum**](FocusModeEnum.md)     |             | [optional] [default to undefined] |
| **context**           | **string**                                |             | [optional] [default to undefined] |
| **created_at**        | **string**                                |             | [readonly] [default to undefined] |
| **updated_at**        | **string**                                |             | [readonly] [default to undefined] |

## Example

```typescript
import { EnergyCheckIn } from "./api";

const instance: EnergyCheckIn = {
  id,
  date,
  energy_level,
  available_minutes,
  focus_mode,
  context,
  created_at,
  updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
