# ApiApi

All URIs are relative to _http://localhost_

| Method                                                                        | HTTP request                                   | Description |
| ----------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| [**apiCommentsCreate**](#apicommentscreate)                                   | **POST** /api/comments/                        |             |
| [**apiCommentsDestroy**](#apicommentsdestroy)                                 | **DELETE** /api/comments/{id}/                 |             |
| [**apiCommentsList**](#apicommentslist)                                       | **GET** /api/comments/                         |             |
| [**apiCommentsPartialUpdate**](#apicommentspartialupdate)                     | **PATCH** /api/comments/{id}/                  |             |
| [**apiCommentsRetrieve**](#apicommentsretrieve)                               | **GET** /api/comments/{id}/                    |             |
| [**apiCommentsUpdate**](#apicommentsupdate)                                   | **PUT** /api/comments/{id}/                    |             |
| [**apiDashboardRetrieve**](#apidashboardretrieve)                             | **GET** /api/dashboard                         |             |
| [**apiEmailDailyDigestCreate**](#apiemaildailydigestcreate)                   | **POST** /api/email/daily-digest               |             |
| [**apiProjectSectionsBulkUpdateUpdate**](#apiprojectsectionsbulkupdateupdate) | **PUT** /api/project_sections/bulk_update/     |             |
| [**apiProjectSectionsCreate**](#apiprojectsectionscreate)                     | **POST** /api/project_sections/                |             |
| [**apiProjectSectionsDestroy**](#apiprojectsectionsdestroy)                   | **DELETE** /api/project_sections/{id}/         |             |
| [**apiProjectSectionsDuplicateCreate**](#apiprojectsectionsduplicatecreate)   | **POST** /api/project_sections/{id}/duplicate/ |             |
| [**apiProjectSectionsList**](#apiprojectsectionslist)                         | **GET** /api/project_sections/                 |             |
| [**apiProjectSectionsPartialUpdate**](#apiprojectsectionspartialupdate)       | **PATCH** /api/project_sections/{id}/          |             |
| [**apiProjectSectionsRetrieve**](#apiprojectsectionsretrieve)                 | **GET** /api/project_sections/{id}/            |             |
| [**apiProjectSectionsUpdate**](#apiprojectsectionsupdate)                     | **PUT** /api/project_sections/{id}/            |             |
| [**apiProjectsBulkUpdateUpdate**](#apiprojectsbulkupdateupdate)               | **PUT** /api/projects/bulk_update/             |             |
| [**apiProjectsCreate**](#apiprojectscreate)                                   | **POST** /api/projects/                        |             |
| [**apiProjectsDestroy**](#apiprojectsdestroy)                                 | **DELETE** /api/projects/{id}/                 |             |
| [**apiProjectsList**](#apiprojectslist)                                       | **GET** /api/projects/                         |             |
| [**apiProjectsPartialUpdate**](#apiprojectspartialupdate)                     | **PATCH** /api/projects/{id}/                  |             |
| [**apiProjectsRetrieve**](#apiprojectsretrieve)                               | **GET** /api/projects/{id}/                    |             |
| [**apiProjectsUpdate**](#apiprojectsupdate)                                   | **PUT** /api/projects/{id}/                    |             |
| [**apiTagsCreate**](#apitagscreate)                                           | **POST** /api/tags/                            |             |
| [**apiTagsDestroy**](#apitagsdestroy)                                         | **DELETE** /api/tags/{slug}/                   |             |
| [**apiTagsList**](#apitagslist)                                               | **GET** /api/tags/                             |             |
| [**apiTagsPartialUpdate**](#apitagspartialupdate)                             | **PATCH** /api/tags/{slug}/                    |             |
| [**apiTagsRetrieve**](#apitagsretrieve)                                       | **GET** /api/tags/{slug}/                      |             |
| [**apiTagsUpdate**](#apitagsupdate)                                           | **PUT** /api/tags/{slug}/                      |             |
| [**apiTasksBulkUpdatePartialUpdate**](#apitasksbulkupdatepartialupdate)       | **PATCH** /api/tasks/bulk_update/              |             |
| [**apiTasksBulkUpdateUpdate**](#apitasksbulkupdateupdate)                     | **PUT** /api/tasks/bulk_update/                |             |
| [**apiTasksCreate**](#apitaskscreate)                                         | **POST** /api/tasks/                           |             |
| [**apiTasksDestroy**](#apitasksdestroy)                                       | **DELETE** /api/tasks/{id}/                    |             |
| [**apiTasksDuplicateCreate**](#apitasksduplicatecreate)                       | **POST** /api/tasks/{id}/duplicate/            |             |
| [**apiTasksList**](#apitaskslist)                                             | **GET** /api/tasks/                            |             |
| [**apiTasksPartialUpdate**](#apitaskspartialupdate)                           | **PATCH** /api/tasks/{id}/                     |             |
| [**apiTasksRetrieve**](#apitasksretrieve)                                     | **GET** /api/tasks/{id}/                       |             |
| [**apiTasksUpdate**](#apitasksupdate)                                         | **PUT** /api/tasks/{id}/                       |             |
| [**apiUsersCreate**](#apiuserscreate)                                         | **POST** /api/users/                           |             |
| [**apiUsersDestroy**](#apiusersdestroy)                                       | **DELETE** /api/users/{id}/                    |             |
| [**apiUsersList**](#apiuserslist)                                             | **GET** /api/users/                            |             |
| [**apiUsersMeRetrieve**](#apiusersmeretrieve)                                 | **GET** /api/users/me/                         |             |
| [**apiUsersOptionsPartialUpdate**](#apiusersoptionspartialupdate)             | **PATCH** /api/users/options/                  |             |
| [**apiUsersPartialUpdate**](#apiuserspartialupdate)                           | **PATCH** /api/users/{id}/                     |             |
| [**apiUsersRetrieve**](#apiusersretrieve)                                     | **GET** /api/users/{id}/                       |             |
| [**apiUsersUpdate**](#apiusersupdate)                                         | **PUT** /api/users/{id}/                       |             |

# **apiCommentsCreate**

> Comment apiCommentsCreate(commentRequest)

### Example

```typescript
import { ApiApi, Configuration, CommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let commentRequest: CommentRequest; //

const { status, data } = await apiInstance.apiCommentsCreate(commentRequest);
```

### Parameters

| Name               | Type               | Description | Notes |
| ------------------ | ------------------ | ----------- | ----- |
| **commentRequest** | **CommentRequest** |             |       |

### Return type

**Comment**

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

# **apiCommentsDestroy**

> apiCommentsDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)

const { status, data } = await apiInstance.apiCommentsDestroy(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this comment. | defaults to undefined |

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

# **apiCommentsList**

> PaginatedCommentList apiCommentsList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let task: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiCommentsList(page, task);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |
| **task** | [**string**] |                                                | (optional) defaults to undefined |

### Return type

**PaginatedCommentList**

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

# **apiCommentsPartialUpdate**

> Comment apiCommentsPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedCommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)
let patchedCommentRequest: PatchedCommentRequest; // (optional)

const { status, data } = await apiInstance.apiCommentsPartialUpdate(
  id,
  patchedCommentRequest,
);
```

### Parameters

| Name                      | Type                      | Description                                      | Notes                 |
| ------------------------- | ------------------------- | ------------------------------------------------ | --------------------- |
| **patchedCommentRequest** | **PatchedCommentRequest** |                                                  |                       |
| **id**                    | [**number**]              | A unique integer value identifying this comment. | defaults to undefined |

### Return type

**Comment**

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

# **apiCommentsRetrieve**

> Comment apiCommentsRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)

const { status, data } = await apiInstance.apiCommentsRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this comment. | defaults to undefined |

### Return type

**Comment**

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

# **apiCommentsUpdate**

> Comment apiCommentsUpdate(commentRequest)

### Example

```typescript
import { ApiApi, Configuration, CommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)
let commentRequest: CommentRequest; //

const { status, data } = await apiInstance.apiCommentsUpdate(
  id,
  commentRequest,
);
```

### Parameters

| Name               | Type               | Description                                      | Notes                 |
| ------------------ | ------------------ | ------------------------------------------------ | --------------------- |
| **commentRequest** | **CommentRequest** |                                                  |                       |
| **id**             | [**number**]       | A unique integer value identifying this comment. | defaults to undefined |

### Return type

**Comment**

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

# **apiDashboardRetrieve**

> apiDashboardRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

const { status, data } = await apiInstance.apiDashboardRetrieve();
```

### Parameters

This endpoint does not have any parameters.

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
| **200**     | No response body | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmailDailyDigestCreate**

> apiEmailDailyDigestCreate()

Send daily digest emails to all users. This endpoint will be triggered by Cloud Scheduler and will send daily digest emails to all users containing their tasks and other relevant information.

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

const { status, data } = await apiInstance.apiEmailDailyDigestCreate();
```

### Parameters

This endpoint does not have any parameters.

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
| **200**     | No response body | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProjectSectionsBulkUpdateUpdate**

> ProjectSection apiProjectSectionsBulkUpdateUpdate(projectSectionRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectSectionRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.apiProjectSectionsBulkUpdateUpdate(
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

# **apiProjectSectionsCreate**

> ProjectSection apiProjectSectionsCreate(projectSectionRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectSectionRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.apiProjectSectionsCreate(
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

# **apiProjectSectionsDestroy**

> apiProjectSectionsDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)

const { status, data } = await apiInstance.apiProjectSectionsDestroy(id);
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

# **apiProjectSectionsDuplicateCreate**

> ProjectSection apiProjectSectionsDuplicateCreate(projectSectionRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectSectionRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.apiProjectSectionsDuplicateCreate(
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

# **apiProjectSectionsList**

> PaginatedProjectSectionList apiProjectSectionsList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.apiProjectSectionsList(page);
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

# **apiProjectSectionsPartialUpdate**

> ProjectSection apiProjectSectionsPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedProjectSectionRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let patchedProjectSectionRequest: PatchedProjectSectionRequest; // (optional)

const { status, data } = await apiInstance.apiProjectSectionsPartialUpdate(
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

# **apiProjectSectionsRetrieve**

> ProjectSection apiProjectSectionsRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)

const { status, data } = await apiInstance.apiProjectSectionsRetrieve(id);
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

# **apiProjectSectionsUpdate**

> ProjectSection apiProjectSectionsUpdate(projectSectionRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectSectionRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project section. (default to undefined)
let projectSectionRequest: ProjectSectionRequest; //

const { status, data } = await apiInstance.apiProjectSectionsUpdate(
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

# **apiProjectsBulkUpdateUpdate**

> ProjectDetail apiProjectsBulkUpdateUpdate(projectDetailRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } =
  await apiInstance.apiProjectsBulkUpdateUpdate(projectDetailRequest);
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

# **apiProjectsCreate**

> ProjectDetail apiProjectsCreate(projectDetailRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } =
  await apiInstance.apiProjectsCreate(projectDetailRequest);
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

# **apiProjectsDestroy**

> apiProjectsDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.apiProjectsDestroy(id);
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

# **apiProjectsList**

> PaginatedProjectList apiProjectsList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.apiProjectsList(page);
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

# **apiProjectsPartialUpdate**

> ProjectDetail apiProjectsPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let patchedProjectDetailRequest: PatchedProjectDetailRequest; // (optional)

const { status, data } = await apiInstance.apiProjectsPartialUpdate(
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

# **apiProjectsRetrieve**

> ProjectDetail apiProjectsRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.apiProjectsRetrieve(id);
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

# **apiProjectsUpdate**

> ProjectDetail apiProjectsUpdate(projectDetailRequest)

### Example

```typescript
import { ApiApi, Configuration, ProjectDetailRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.apiProjectsUpdate(
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

# **apiTagsCreate**

> Tag apiTagsCreate(tagRequest)

### Example

```typescript
import { ApiApi, Configuration, TagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let tagRequest: TagRequest; //

const { status, data } = await apiInstance.apiTagsCreate(tagRequest);
```

### Parameters

| Name           | Type           | Description | Notes |
| -------------- | -------------- | ----------- | ----- |
| **tagRequest** | **TagRequest** |             |       |

### Return type

**Tag**

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

# **apiTagsDestroy**

> apiTagsDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.apiTagsDestroy(slug);
```

### Parameters

| Name     | Type         | Description | Notes                 |
| -------- | ------------ | ----------- | --------------------- |
| **slug** | [**string**] |             | defaults to undefined |

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

# **apiTagsList**

> PaginatedTagList apiTagsList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.apiTagsList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedTagList**

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

# **apiTagsPartialUpdate**

> Tag apiTagsPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedTagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let slug: string; // (default to undefined)
let patchedTagRequest: PatchedTagRequest; // (optional)

const { status, data } = await apiInstance.apiTagsPartialUpdate(
  slug,
  patchedTagRequest,
);
```

### Parameters

| Name                  | Type                  | Description | Notes                 |
| --------------------- | --------------------- | ----------- | --------------------- |
| **patchedTagRequest** | **PatchedTagRequest** |             |                       |
| **slug**              | [**string**]          |             | defaults to undefined |

### Return type

**Tag**

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

# **apiTagsRetrieve**

> TagDetail apiTagsRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.apiTagsRetrieve(slug);
```

### Parameters

| Name     | Type         | Description | Notes                 |
| -------- | ------------ | ----------- | --------------------- |
| **slug** | [**string**] |             | defaults to undefined |

### Return type

**TagDetail**

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

# **apiTagsUpdate**

> Tag apiTagsUpdate(tagRequest)

### Example

```typescript
import { ApiApi, Configuration, TagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let slug: string; // (default to undefined)
let tagRequest: TagRequest; //

const { status, data } = await apiInstance.apiTagsUpdate(slug, tagRequest);
```

### Parameters

| Name           | Type           | Description | Notes                 |
| -------------- | -------------- | ----------- | --------------------- |
| **tagRequest** | **TagRequest** |             |                       |
| **slug**       | [**string**]   |             | defaults to undefined |

### Return type

**Tag**

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

# **apiTasksBulkUpdatePartialUpdate**

> Task apiTasksBulkUpdatePartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedTaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let patchedTaskRequest: PatchedTaskRequest; // (optional)

const { status, data } =
  await apiInstance.apiTasksBulkUpdatePartialUpdate(patchedTaskRequest);
```

### Parameters

| Name                   | Type                   | Description | Notes |
| ---------------------- | ---------------------- | ----------- | ----- |
| **patchedTaskRequest** | **PatchedTaskRequest** |             |       |

### Return type

**Task**

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

# **apiTasksBulkUpdateUpdate**

> Task apiTasksBulkUpdateUpdate(taskRequest)

### Example

```typescript
import { ApiApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let taskRequest: TaskRequest; //

const { status, data } =
  await apiInstance.apiTasksBulkUpdateUpdate(taskRequest);
```

### Parameters

| Name            | Type            | Description | Notes |
| --------------- | --------------- | ----------- | ----- |
| **taskRequest** | **TaskRequest** |             |       |

### Return type

**Task**

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

# **apiTasksCreate**

> Task apiTasksCreate(taskRequest)

### Example

```typescript
import { ApiApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.apiTasksCreate(taskRequest);
```

### Parameters

| Name            | Type            | Description | Notes |
| --------------- | --------------- | ----------- | ----- |
| **taskRequest** | **TaskRequest** |             |       |

### Return type

**Task**

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

# **apiTasksDestroy**

> apiTasksDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.apiTasksDestroy(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined |

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

# **apiTasksDuplicateCreate**

> Task apiTasksDuplicateCreate(taskRequest)

### Example

```typescript
import { ApiApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.apiTasksDuplicateCreate(
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

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTasksList**

> PaginatedTaskList apiTasksList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let endDate: string; // (optional) (default to undefined)
let inbox: boolean; // (optional) (default to undefined)
let ordering: string; //Which field to use when ordering the results. (optional) (default to undefined)
let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let tag: string; // (optional) (default to undefined)
let today: boolean; // (optional) (default to undefined)
let upcoming: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiTasksList(
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

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTasksPartialUpdate**

> Task apiTasksPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedTaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let patchedTaskRequest: PatchedTaskRequest; // (optional)

const { status, data } = await apiInstance.apiTasksPartialUpdate(
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

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTasksRetrieve**

> Task apiTasksRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.apiTasksRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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

# **apiTasksUpdate**

> Task apiTasksUpdate(taskRequest)

### Example

```typescript
import { ApiApi, Configuration, TaskRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let taskRequest: TaskRequest; //

const { status, data } = await apiInstance.apiTasksUpdate(id, taskRequest);
```

### Parameters

| Name            | Type            | Description                                   | Notes                 |
| --------------- | --------------- | --------------------------------------------- | --------------------- |
| **taskRequest** | **TaskRequest** |                                               |                       |
| **id**          | [**number**]    | A unique integer value identifying this task. | defaults to undefined |

### Return type

**Task**

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

# **apiUsersCreate**

> User apiUsersCreate(userRequest)

### Example

```typescript
import { ApiApi, Configuration, UserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let userRequest: UserRequest; //

const { status, data } = await apiInstance.apiUsersCreate(userRequest);
```

### Parameters

| Name            | Type            | Description | Notes |
| --------------- | --------------- | ----------- | ----- |
| **userRequest** | **UserRequest** |             |       |

### Return type

**User**

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

# **apiUsersDestroy**

> apiUsersDestroy()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.apiUsersDestroy(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined |

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

# **apiUsersList**

> PaginatedUserList apiUsersList()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.apiUsersList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedUserList**

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

# **apiUsersMeRetrieve**

> User apiUsersMeRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

const { status, data } = await apiInstance.apiUsersMeRetrieve();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**User**

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

# **apiUsersOptionsPartialUpdate**

> User apiUsersOptionsPartialUpdate()

Handler method for HTTP \'OPTIONS\' request.

### Example

```typescript
import { ApiApi, Configuration, PatchedUserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } =
  await apiInstance.apiUsersOptionsPartialUpdate(patchedUserRequest);
```

### Parameters

| Name                   | Type                   | Description | Notes |
| ---------------------- | ---------------------- | ----------- | ----- |
| **patchedUserRequest** | **PatchedUserRequest** |             |       |

### Return type

**User**

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

# **apiUsersPartialUpdate**

> User apiUsersPartialUpdate()

### Example

```typescript
import { ApiApi, Configuration, PatchedUserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } = await apiInstance.apiUsersPartialUpdate(
  id,
  patchedUserRequest,
);
```

### Parameters

| Name                   | Type                   | Description                                   | Notes                 |
| ---------------------- | ---------------------- | --------------------------------------------- | --------------------- |
| **patchedUserRequest** | **PatchedUserRequest** |                                               |                       |
| **id**                 | [**number**]           | A unique integer value identifying this user. | defaults to undefined |

### Return type

**User**

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

# **apiUsersRetrieve**

> User apiUsersRetrieve()

### Example

```typescript
import { ApiApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.apiUsersRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                   | Notes                 |
| ------ | ------------ | --------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined |

### Return type

**User**

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

# **apiUsersUpdate**

> User apiUsersUpdate(userRequest)

### Example

```typescript
import { ApiApi, Configuration, UserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new ApiApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let userRequest: UserRequest; //

const { status, data } = await apiInstance.apiUsersUpdate(id, userRequest);
```

### Parameters

| Name            | Type            | Description                                   | Notes                 |
| --------------- | --------------- | --------------------------------------------- | --------------------- |
| **userRequest** | **UserRequest** |                                               |                       |
| **id**          | [**number**]    | A unique integer value identifying this user. | defaults to undefined |

### Return type

**User**

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
