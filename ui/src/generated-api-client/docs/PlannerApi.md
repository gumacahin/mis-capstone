# PlannerApi

All URIs are relative to _http://localhost_

| Method                                                                  | HTTP request                                         | Description |
| ----------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| [**plannerCheckInCreate**](#plannercheckincreate)                       | **POST** /api/planner/check-in/                      |             |
| [**plannerEvaluationRetrieve**](#plannerevaluationretrieve)             | **GET** /api/planner/evaluation/                     |             |
| [**plannerFeedbackCreate**](#plannerfeedbackcreate)                     | **POST** /api/planner/feedback/                      |             |
| [**plannerRebuildCreate**](#plannerrebuildcreate)                       | **POST** /api/planner/rebuild/                       |             |
| [**plannerSuggestionsAcceptCreate**](#plannersuggestionsacceptcreate)   | **POST** /api/planner/suggestions/{item_id}/accept/  |             |
| [**plannerSuggestionsDismissCreate**](#plannersuggestionsdismisscreate) | **POST** /api/planner/suggestions/{item_id}/dismiss/ |             |
| [**plannerSuggestionsSnoozeCreate**](#plannersuggestionssnoozecreate)   | **POST** /api/planner/suggestions/{item_id}/snooze/  |             |
| [**plannerTodayRetrieve**](#plannertodayretrieve)                       | **GET** /api/planner/today/                          |             |

# **plannerCheckInCreate**

> TodayPlan plannerCheckInCreate()

### Example

```typescript
import { PlannerApi, Configuration, EnergyCheckInRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

let energyCheckInRequest: EnergyCheckInRequest; // (optional)

const { status, data } =
  await apiInstance.plannerCheckInCreate(energyCheckInRequest);
```

### Parameters

| Name                     | Type                     | Description | Notes |
| ------------------------ | ------------------------ | ----------- | ----- |
| **energyCheckInRequest** | **EnergyCheckInRequest** |             |       |

### Return type

**TodayPlan**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerEvaluationRetrieve**

> PlannerEvaluationSummary plannerEvaluationRetrieve()

### Example

```typescript
import { PlannerApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

const { status, data } = await apiInstance.plannerEvaluationRetrieve();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**PlannerEvaluationSummary**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerFeedbackCreate**

> TodayPlanFeedback plannerFeedbackCreate(todayPlanFeedbackRequest)

### Example

```typescript
import { PlannerApi, Configuration, TodayPlanFeedbackRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

let todayPlanFeedbackRequest: TodayPlanFeedbackRequest; //

const { status, data } = await apiInstance.plannerFeedbackCreate(
  todayPlanFeedbackRequest,
);
```

### Parameters

| Name                         | Type                         | Description | Notes |
| ---------------------------- | ---------------------------- | ----------- | ----- |
| **todayPlanFeedbackRequest** | **TodayPlanFeedbackRequest** |             |       |

### Return type

**TodayPlanFeedback**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerRebuildCreate**

> TodayPlan plannerRebuildCreate()

### Example

```typescript
import { PlannerApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

const { status, data } = await apiInstance.plannerRebuildCreate();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**TodayPlan**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerSuggestionsAcceptCreate**

> PlanItem plannerSuggestionsAcceptCreate()

### Example

```typescript
import { PlannerApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

let itemId: number; // (default to undefined)

const { status, data } =
  await apiInstance.plannerSuggestionsAcceptCreate(itemId);
```

### Parameters

| Name       | Type         | Description | Notes                 |
| ---------- | ------------ | ----------- | --------------------- |
| **itemId** | [**number**] |             | defaults to undefined |

### Return type

**PlanItem**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerSuggestionsDismissCreate**

> PlanItem plannerSuggestionsDismissCreate()

### Example

```typescript
import { PlannerApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

let itemId: number; // (default to undefined)

const { status, data } =
  await apiInstance.plannerSuggestionsDismissCreate(itemId);
```

### Parameters

| Name       | Type         | Description | Notes                 |
| ---------- | ------------ | ----------- | --------------------- |
| **itemId** | [**number**] |             | defaults to undefined |

### Return type

**PlanItem**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerSuggestionsSnoozeCreate**

> PlanItem plannerSuggestionsSnoozeCreate()

### Example

```typescript
import { PlannerApi, Configuration, SnoozePlanItemRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

let itemId: number; // (default to undefined)
let snoozePlanItemRequest: SnoozePlanItemRequest; // (optional)

const { status, data } = await apiInstance.plannerSuggestionsSnoozeCreate(
  itemId,
  snoozePlanItemRequest,
);
```

### Parameters

| Name                      | Type                      | Description | Notes                 |
| ------------------------- | ------------------------- | ----------- | --------------------- |
| **snoozePlanItemRequest** | **SnoozePlanItemRequest** |             |                       |
| **itemId**                | [**number**]              |             | defaults to undefined |

### Return type

**PlanItem**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plannerTodayRetrieve**

> TodayPlan plannerTodayRetrieve()

### Example

```typescript
import { PlannerApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new PlannerApi(configuration);

const { status, data } = await apiInstance.plannerTodayRetrieve();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**TodayPlan**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
