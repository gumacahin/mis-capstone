# ProjectSectionsApi

All URIs are relative to _http://localhost_

| Method                                                                  | HTTP request                                   | Description |
| ----------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| [**projectSectionsBulkUpdateUpdate**](#projectsectionsbulkupdateupdate) | **PUT** /api/project_sections/bulk_update/     |             |
| [**projectSectionsCreate**](#projectsectionscreate)                     | **POST** /api/project_sections/                |             |
| [**projectSectionsDestroy**](#projectsectionsdestroy)                   | **DELETE** /api/project_sections/{id}/         |             |
| [**projectSectionsDuplicateCreate**](#projectsectionsduplicatecreate)   | **POST** /api/project_sections/{id}/duplicate/ |             |
| [**projectSectionsList**](#projectsectionslist)                         | **GET** /api/project_sections/                 |             |
| [**projectSectionsPartialUpdate**](#projectsectionspartialupdate)       | **PATCH** /api/project_sections/{id}/          |             |
| [**projectSectionsRetrieve**](#projectsectionsretrieve)                 | **GET** /api/project_sections/{id}/            |             |
| [**projectSectionsUpdate**](#projectsectionsupdate)                     | **PUT** /api/project_sections/{id}/            |             |

# **projectSectionsBulkUpdateUpdate**

> ProjectSection projectSectionsBulkUpdateUpdate(projectSectionRequest)

### Example

```typescript
import {
  ProjectSectionsApi,
  Configuration,
  ProjectSectionRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.projectSectionsBulkUpdateUpdate(
  projectSectionRequest,
);
```

### Parameters

| Name                      | Type                      | Description | Notes |
| ------------------------- | ------------------------- | ----------- | ----- |
| **projectSectionRequest** | **ProjectSectionRequest** |             |       |

### Return type

**ProjectSection**

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

# **projectSectionsCreate**

> ProjectSection projectSectionsCreate(projectSectionRequest)

### Example

```typescript
import {
  ProjectSectionsApi,
  Configuration,
  ProjectSectionRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.projectSectionsCreate(
  projectSectionRequest,
);
```

### Parameters

| Name                      | Type                      | Description | Notes |
| ------------------------- | ------------------------- | ----------- | ----- |
| **projectSectionRequest** | **ProjectSectionRequest** |             |       |

### Return type

**ProjectSection**

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

# **projectSectionsDestroy**

> projectSectionsDestroy()

### Example

```typescript
import { ProjectSectionsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)

const { status, data } = await apiInstance.projectSectionsDestroy(id);
```

### Parameters

| Name   | Type         | Description                                              | Notes                 |
| ------ | ------------ | -------------------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this project section. | defaults to undefined |

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

# **projectSectionsDuplicateCreate**

> ProjectSection projectSectionsDuplicateCreate(projectSectionRequest)

### Example

```typescript
import {
  ProjectSectionsApi,
  Configuration,
  ProjectSectionRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.projectSectionsDuplicateCreate(
  id,
  projectSectionRequest,
);
```

### Parameters

| Name                      | Type                      | Description                                              | Notes                 |
| ------------------------- | ------------------------- | -------------------------------------------------------- | --------------------- |
| **projectSectionRequest** | **ProjectSectionRequest** |                                                          |                       |
| **id**                    | [**number**]              | A unique integer value identifying this project section. | defaults to undefined |

### Return type

**ProjectSection**

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

# **projectSectionsList**

> PaginatedProjectSectionList projectSectionsList()

### Example

```typescript
import { ProjectSectionsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.projectSectionsList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedProjectSectionList**

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

# **projectSectionsPartialUpdate**

> ProjectSection projectSectionsPartialUpdate()

### Example

```typescript
import {
  ProjectSectionsApi,
  Configuration,
  PatchedProjectSectionRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let patchedProjectSectionRequest: PatchedProjectSectionRequest; // (optional)

const { status, data } = await apiInstance.projectSectionsPartialUpdate(
  id,
  patchedProjectSectionRequest,
);
```

### Parameters

| Name                             | Type                             | Description                                              | Notes                 |
| -------------------------------- | -------------------------------- | -------------------------------------------------------- | --------------------- |
| **patchedProjectSectionRequest** | **PatchedProjectSectionRequest** |                                                          |                       |
| **id**                           | [**number**]                     | A unique integer value identifying this project section. | defaults to undefined |

### Return type

**ProjectSection**

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

# **projectSectionsRetrieve**

> ProjectSection projectSectionsRetrieve()

### Example

```typescript
import { ProjectSectionsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)

const { status, data } = await apiInstance.projectSectionsRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                              | Notes                 |
| ------ | ------------ | -------------------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this project section. | defaults to undefined |

### Return type

**ProjectSection**

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

# **projectSectionsUpdate**

> ProjectSection projectSectionsUpdate(projectSectionRequest)

### Example

```typescript
import {
  ProjectSectionsApi,
  Configuration,
  ProjectSectionRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new ProjectSectionsApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.projectSectionsUpdate(
  id,
  projectSectionRequest,
);
```

### Parameters

| Name                      | Type                      | Description                                              | Notes                 |
| ------------------------- | ------------------------- | -------------------------------------------------------- | --------------------- |
| **projectSectionRequest** | **ProjectSectionRequest** |                                                          |                       |
| **id**                    | [**number**]              | A unique integer value identifying this project section. | defaults to undefined |

### Return type

**ProjectSection**

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
