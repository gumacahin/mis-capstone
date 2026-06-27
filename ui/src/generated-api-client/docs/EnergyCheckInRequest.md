# EnergyCheckInRequest

## Properties

| Name                  | Type                                      | Description | Notes                             |
| --------------------- | ----------------------------------------- | ----------- | --------------------------------- |
| **energy_level**      | [**EnergyLevelEnum**](EnergyLevelEnum.md) |             | [optional] [default to undefined] |
| **available_minutes** | **number**                                |             | [optional] [default to undefined] |
| **focus_mode**        | [**FocusModeEnum**](FocusModeEnum.md)     |             | [optional] [default to undefined] |
| **context**           | **string**                                |             | [optional] [default to undefined] |

## Example

```typescript
import { EnergyCheckInRequest } from "./api";

const instance: EnergyCheckInRequest = {
  energy_level,
  available_minutes,
  focus_mode,
  context,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
