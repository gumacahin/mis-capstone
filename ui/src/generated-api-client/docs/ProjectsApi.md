# ProjectsApi

All URIs are relative to _http://localhost_

| Method                                                    | HTTP request                       | Description |
| --------------------------------------------------------- | ---------------------------------- | ----------- |
| [**projectsBulkUpdateUpdate**](#projectsbulkupdateupdate) | **PUT** /api/projects/bulk_update/ |             |
| [**projectsCreate**](#projectscreate)                     | **POST** /api/projects/            |             |
| [**projectsDestroy**](#projectsdestroy)                   | **DELETE** /api/projects/{id}/     |             |
| [**projectsList**](#projectslist)                         | **GET** /api/projects/             |             |
| [**projectsPartialUpdate**](#projectspartialupdate)       | **PATCH** /api/projects/{id}/      |             |
| [**projectsRetrieve**](#projectsretrieve)                 | **GET** /api/projects/{id}/        |             |
| [**projectsUpdate**](#projectsupdate)                     | **PUT** /api/projects/{id}/        |             |

# **projectsBulkUpdateUpdate**

> ProjectDetail projectsBulkUpdateUpdate(projectDetailRequest)

### Example

```typescript
import { ProjectsApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } =
  await apiInstance.projectsBulkUpdateUpdate(projectDetailRequest);
```

### Parameters

| Name                     | Type                     | Description | Notes |
| ------------------------ | ------------------------ | ----------- | ----- |
| **projectDetailRequest** | **ProjectDetailRequest** |             |       |

### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsCreate**

> ProjectDetail projectsCreate(projectDetailRequest)

### Example

```typescript
import { ProjectsApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.projectsCreate(projectDetailRequest);
```

### Parameters

| Name                     | Type                     | Description | Notes |
| ------------------------ | ------------------------ | ----------- | ----- |
| **projectDetailRequest** | **ProjectDetailRequest** |             |       |

### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsDestroy**

> projectsDestroy()

### Example

```typescript
import { ProjectsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.projectsDestroy(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### HTTP response details

| Status code | Description      | Response headers |
| ----------- | ---------------- | ---------------- |
| **204**     | No response body | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsList**

> PaginatedProjectList projectsList()

### Example

```typescript
import { ProjectsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.projectsList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedProjectList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsPartialUpdate**

> ProjectDetail projectsPartialUpdate()

### Example

```typescript
import { ProjectsApi, Configuration, PatchedProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let patchedProjectDetailRequest: PatchedProjectDetailRequest; // (optional)

const { status, data } = await apiInstance.projectsPartialUpdate(
  id,
  patchedProjectDetailRequest,
);
```

### Parameters

| Name                            | Type                            | Description                                      | Notes                 |
| ------------------------------- | ------------------------------- | ------------------------------------------------ | --------------------- |
| **patchedProjectDetailRequest** | **PatchedProjectDetailRequest** |                                                  |                       |
| **id**                          | [**number**]                    | A unique integer value identifying this project. | defaults to undefined |

### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsRetrieve**

> ProjectDetail projectsRetrieve()

### Example

```typescript
import { ProjectsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.projectsRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined |

### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsUpdate**

> ProjectDetail projectsUpdate(projectDetailRequest)

### Example

```typescript
import { ProjectsApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.projectsUpdate(
  id,
  projectDetailRequest,
);
```

### Parameters

| Name                     | Type                     | Description                                      | Notes                 |
| ------------------------ | ------------------------ | ------------------------------------------------ | --------------------- |
| **projectDetailRequest** | **ProjectDetailRequest** |                                                  |                       |
| **id**                   | [**number**]             | A unique integer value identifying this project. | defaults to undefined |

### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
