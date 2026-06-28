# TasksApi

All URIs are relative to _http://localhost_

| Method                                                            | HTTP request                        | Description |
| ----------------------------------------------------------------- | ----------------------------------- | ----------- |
| [**tasksBulkUpdatePartialUpdate**](#tasksbulkupdatepartialupdate) | **PATCH** /api/tasks/bulk_update/   |             |
| [**tasksBulkUpdateUpdate**](#tasksbulkupdateupdate)               | **PUT** /api/tasks/bulk_update/     |             |
| [**tasksCreate**](#taskscreate)                                   | **POST** /api/tasks/                |             |
| [**tasksDestroy**](#tasksdestroy)                                 | **DELETE** /api/tasks/{id}/         |             |
| [**tasksDuplicateCreate**](#tasksduplicatecreate)                 | **POST** /api/tasks/{id}/duplicate/ |             |
| [**tasksList**](#taskslist)                                       | **GET** /api/tasks/                 |             |
| [**tasksPartialUpdate**](#taskspartialupdate)                     | **PATCH** /api/tasks/{id}/          |             |
| [**tasksRetrieve**](#tasksretrieve)                               | **GET** /api/tasks/{id}/            |             |
| [**tasksUpdate**](#tasksupdate)                                   | **PUT** /api/tasks/{id}/            |             |

# **tasksBulkUpdatePartialUpdate**

> Task tasksBulkUpdatePartialUpdate()

### Example

```typescript
import { TasksApi, Configuration, PatchedTaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let patchedTaskRequest: PatchedTaskRequest; // (optional)

const { status, data } =
  await apiInstance.tasksBulkUpdatePartialUpdate(patchedTaskRequest);
```

### Parameters

| Name                   | Type                   | Description | Notes |
| ---------------------- | ---------------------- | ----------- | ----- |
| **patchedTaskRequest** | **PatchedTaskRequest** |             |       |

### Return type

**Task**

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

# **tasksBulkUpdateUpdate**

> Task tasksBulkUpdateUpdate(taskRequest)

### Example

```typescript
import { TasksApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.tasksBulkUpdateUpdate(taskRequest);
```

### Parameters

| Name            | Type            | Description | Notes |
| --------------- | --------------- | ----------- | ----- |
| **taskRequest** | **TaskRequest** |             |       |

### Return type

**Task**

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

# **tasksCreate**

> Task tasksCreate(taskRequest)

### Example

```typescript
import { TasksApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.tasksCreate(taskRequest);
```

### Parameters

| Name            | Type            | Description | Notes |
| --------------- | --------------- | ----------- | ----- |
| **taskRequest** | **TaskRequest** |             |       |

### Return type

**Task**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksDestroy**

> tasksDestroy()

### Example

```typescript
import { TasksApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.tasksDestroy(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### HTTP response details

| Status code | Description      | Response headers |
| ----------- | ---------------- | ---------------- |
| **204**     | No response body | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksDuplicateCreate**

> Task tasksDuplicateCreate(taskRequest)

### Example

```typescript
import { TasksApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.tasksDuplicateCreate(
  id,
  taskRequest,
);
```

### Parameters

| Name            | Type            | Description                                   | Notes                 |
| --------------- | --------------- | --------------------------------------------- | --------------------- |
| **taskRequest** | **TaskRequest** |                                               |                       |
| **id**          | [**number**]    | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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

# **tasksList**

> PaginatedTaskList tasksList()

### Example

```typescript
import { TasksApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let endDate: string; // (optional) (default to undefined)
let inbox: boolean; // (optional) (default to undefined)
let ordering: string; //Which field to use when ordering the results. (optional) (default to undefined)
let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let tag: string; // (optional) (default to undefined)
let today: boolean; // (optional) (default to undefined)
let upcoming: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.tasksList(
  endDate,
  inbox,
  ordering,
  page,
  startDate,
  tag,
  today,
  upcoming,
);
```

### Parameters

| Name          | Type          | Description                                    | Notes                            |
| ------------- | ------------- | ---------------------------------------------- | -------------------------------- |
| **endDate**   | [**string**]  |                                                | (optional) defaults to undefined |
| **inbox**     | [**boolean**] |                                                | (optional) defaults to undefined |
| **ordering**  | [**string**]  | Which field to use when ordering the results.  | (optional) defaults to undefined |
| **page**      | [**number**]  | A page number within the paginated result set. | (optional) defaults to undefined |
| **startDate** | [**string**]  |                                                | (optional) defaults to undefined |
| **tag**       | [**string**]  |                                                | (optional) defaults to undefined |
| **today**     | [**boolean**] |                                                | (optional) defaults to undefined |
| **upcoming**  | [**boolean**] |                                                | (optional) defaults to undefined |

### Return type

**PaginatedTaskList**

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

# **tasksPartialUpdate**

> Task tasksPartialUpdate()

### Example

```typescript
import { TasksApi, Configuration, PatchedTaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let patchedTaskRequest: PatchedTaskRequest; // (optional)

const { status, data } = await apiInstance.tasksPartialUpdate(
  id,
  patchedTaskRequest,
);
```

### Parameters

| Name                   | Type                   | Description                                   | Notes                 |
| ---------------------- | ---------------------- | --------------------------------------------- | --------------------- |
| **patchedTaskRequest** | **PatchedTaskRequest** |                                               |                       |
| **id**                 | [**number**]           | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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

# **tasksRetrieve**

> Task tasksRetrieve()

### Example

```typescript
import { TasksApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.tasksRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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

# **tasksUpdate**

> Task tasksUpdate(taskRequest)

### Example

```typescript
import { TasksApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.tasksUpdate(id, taskRequest);
```

### Parameters

| Name            | Type            | Description                                   | Notes                 |
| --------------- | --------------- | --------------------------------------------- | --------------------- |
| **taskRequest** | **TaskRequest** |                                               |                       |
| **id**          | [**number**]    | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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
