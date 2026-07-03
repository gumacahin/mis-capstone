# ProjectSectionRequest

## Properties

| Name                  | Type        | Description | Notes                             |
| --------------------- | ----------- | ----------- | --------------------------------- |
| **project**           | **number**  |             | [default to undefined]            |
| **title**             | **string**  |             | [default to undefined]            |
| **order**             | **number**  |             | [optional] [default to undefined] |
| **is_default**        | **boolean** |             | [optional] [default to undefined] |
| **preceding_section** | **number**  |             | [default to undefined]            |
| **source_project**    | **number**  |             | [optional] [default to undefined] |

## Example

```typescript
import { ProjectSectionRequest } from "./api";

const instance: ProjectSectionRequest = {
  project,
  title,
  order,
  is_default,
  preceding_section,
  source_project,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
