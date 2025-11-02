# ApiAdminApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminProjectsBulkUpdateUpdate**](#apiadminprojectsbulkupdateupdate) | **PUT** /api-admin/projects/bulk_update/ | |
|[**apiAdminProjectsCreate**](#apiadminprojectscreate) | **POST** /api-admin/projects/ | |
|[**apiAdminProjectsDestroy**](#apiadminprojectsdestroy) | **DELETE** /api-admin/projects/{id}/ | |
|[**apiAdminProjectsList**](#apiadminprojectslist) | **GET** /api-admin/projects/ | |
|[**apiAdminProjectsPartialUpdate**](#apiadminprojectspartialupdate) | **PATCH** /api-admin/projects/{id}/ | |
|[**apiAdminProjectsRetrieve**](#apiadminprojectsretrieve) | **GET** /api-admin/projects/{id}/ | |
|[**apiAdminProjectsUpdate**](#apiadminprojectsupdate) | **PUT** /api-admin/projects/{id}/ | |
|[**apiAdminTagsCreate**](#apiadmintagscreate) | **POST** /api-admin/tags/ | |
|[**apiAdminTagsDestroy**](#apiadmintagsdestroy) | **DELETE** /api-admin/tags/{id}/ | |
|[**apiAdminTagsList**](#apiadmintagslist) | **GET** /api-admin/tags/ | |
|[**apiAdminTagsPartialUpdate**](#apiadmintagspartialupdate) | **PATCH** /api-admin/tags/{id}/ | |
|[**apiAdminTagsRetrieve**](#apiadmintagsretrieve) | **GET** /api-admin/tags/{id}/ | |
|[**apiAdminTagsUpdate**](#apiadmintagsupdate) | **PUT** /api-admin/tags/{id}/ | |
|[**apiAdminTasksCreate**](#apiadmintaskscreate) | **POST** /api-admin/tasks/ | |
|[**apiAdminTasksDestroy**](#apiadmintasksdestroy) | **DELETE** /api-admin/tasks/{id}/ | |
|[**apiAdminTasksList**](#apiadmintaskslist) | **GET** /api-admin/tasks/ | |
|[**apiAdminTasksPartialUpdate**](#apiadmintaskspartialupdate) | **PATCH** /api-admin/tasks/{id}/ | |
|[**apiAdminTasksRetrieve**](#apiadmintasksretrieve) | **GET** /api-admin/tasks/{id}/ | |
|[**apiAdminTasksUpdate**](#apiadmintasksupdate) | **PUT** /api-admin/tasks/{id}/ | |
|[**apiAdminUsersCreate**](#apiadminuserscreate) | **POST** /api-admin/users/ | |
|[**apiAdminUsersDestroy**](#apiadminusersdestroy) | **DELETE** /api-admin/users/{id}/ | |
|[**apiAdminUsersList**](#apiadminuserslist) | **GET** /api-admin/users/ | |
|[**apiAdminUsersMeRetrieve**](#apiadminusersmeretrieve) | **GET** /api-admin/users/me/ | |
|[**apiAdminUsersOptionsPartialUpdate**](#apiadminusersoptionspartialupdate) | **PATCH** /api-admin/users/options/ | |
|[**apiAdminUsersPartialUpdate**](#apiadminuserspartialupdate) | **PATCH** /api-admin/users/{id}/ | |
|[**apiAdminUsersRetrieve**](#apiadminusersretrieve) | **GET** /api-admin/users/{id}/ | |
|[**apiAdminUsersUpdate**](#apiadminusersupdate) | **PUT** /api-admin/users/{id}/ | |

# **apiAdminProjectsBulkUpdateUpdate**
> ProjectDetail apiAdminProjectsBulkUpdateUpdate(projectDetailRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    ProjectDetailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.apiAdminProjectsBulkUpdateUpdate(
    projectDetailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectDetailRequest** | **ProjectDetailRequest**|  | |


### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsCreate**
> ProjectDetail apiAdminProjectsCreate(projectDetailRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    ProjectDetailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.apiAdminProjectsCreate(
    projectDetailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectDetailRequest** | **ProjectDetailRequest**|  | |


### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsDestroy**
> apiAdminProjectsDestroy()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.apiAdminProjectsDestroy(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsList**
> PaginatedProjectAdminList apiAdminProjectsList()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let pageSize: number; //Number of results to return per page. (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminProjectsList(
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined|
| **pageSize** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|


### Return type

**PaginatedProjectAdminList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsPartialUpdate**
> ProjectDetail apiAdminProjectsPartialUpdate()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    PatchedProjectDetailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let patchedProjectDetailRequest: PatchedProjectDetailRequest; // (optional)

const { status, data } = await apiInstance.apiAdminProjectsPartialUpdate(
    id,
    patchedProjectDetailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedProjectDetailRequest** | **PatchedProjectDetailRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined|


### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsRetrieve**
> ProjectDetail apiAdminProjectsRetrieve()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)

const { status, data } = await apiInstance.apiAdminProjectsRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined|


### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminProjectsUpdate**
> ProjectDetail apiAdminProjectsUpdate(projectDetailRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    ProjectDetailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this project. (default to undefined)
let projectDetailRequest: ProjectDetailRequest; //

const { status, data } = await apiInstance.apiAdminProjectsUpdate(
    id,
    projectDetailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectDetailRequest** | **ProjectDetailRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this project. | defaults to undefined|


### Return type

**ProjectDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsCreate**
> TagAdmin apiAdminTagsCreate(tagAdminRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    TagAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let tagAdminRequest: TagAdminRequest; //

const { status, data } = await apiInstance.apiAdminTagsCreate(
    tagAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagAdminRequest** | **TagAdminRequest**|  | |


### Return type

**TagAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsDestroy**
> apiAdminTagsDestroy()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this tag. (default to undefined)

const { status, data } = await apiInstance.apiAdminTagsDestroy(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this tag. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsList**
> PaginatedTagAdminList apiAdminTagsList()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let pageSize: number; //Number of results to return per page. (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminTagsList(
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined|
| **pageSize** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|


### Return type

**PaginatedTagAdminList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsPartialUpdate**
> TagAdmin apiAdminTagsPartialUpdate()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    PatchedTagAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this tag. (default to undefined)
let patchedTagAdminRequest: PatchedTagAdminRequest; // (optional)

const { status, data } = await apiInstance.apiAdminTagsPartialUpdate(
    id,
    patchedTagAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedTagAdminRequest** | **PatchedTagAdminRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this tag. | defaults to undefined|


### Return type

**TagAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsRetrieve**
> TagDetail apiAdminTagsRetrieve()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this tag. (default to undefined)

const { status, data } = await apiInstance.apiAdminTagsRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this tag. | defaults to undefined|


### Return type

**TagDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTagsUpdate**
> TagAdmin apiAdminTagsUpdate(tagAdminRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    TagAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this tag. (default to undefined)
let tagAdminRequest: TagAdminRequest; //

const { status, data } = await apiInstance.apiAdminTagsUpdate(
    id,
    tagAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagAdminRequest** | **TagAdminRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this tag. | defaults to undefined|


### Return type

**TagAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksCreate**
> TaskAdmin apiAdminTasksCreate(taskAdminRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    TaskAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let taskAdminRequest: TaskAdminRequest; //

const { status, data } = await apiInstance.apiAdminTasksCreate(
    taskAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskAdminRequest** | **TaskAdminRequest**|  | |


### Return type

**TaskAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksDestroy**
> apiAdminTasksDestroy()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.apiAdminTasksDestroy(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksList**
> PaginatedTaskAdminList apiAdminTasksList()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let ordering: string; //Which field to use when ordering the results. (optional) (default to undefined)
let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let pageSize: number; //Number of results to return per page. (optional) (default to undefined)
let search: string; //A search term. (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminTasksList(
    ordering,
    page,
    pageSize,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ordering** | [**string**] | Which field to use when ordering the results. | (optional) defaults to undefined|
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined|
| **pageSize** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|
| **search** | [**string**] | A search term. | (optional) defaults to undefined|


### Return type

**PaginatedTaskAdminList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksPartialUpdate**
> TaskAdmin apiAdminTasksPartialUpdate()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    PatchedTaskAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let patchedTaskAdminRequest: PatchedTaskAdminRequest; // (optional)

const { status, data } = await apiInstance.apiAdminTasksPartialUpdate(
    id,
    patchedTaskAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedTaskAdminRequest** | **PatchedTaskAdminRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined|


### Return type

**TaskAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksRetrieve**
> TaskAdmin apiAdminTasksRetrieve()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)

const { status, data } = await apiInstance.apiAdminTasksRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined|


### Return type

**TaskAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminTasksUpdate**
> TaskAdmin apiAdminTasksUpdate(taskAdminRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    TaskAdminRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this task. (default to undefined)
let taskAdminRequest: TaskAdminRequest; //

const { status, data } = await apiInstance.apiAdminTasksUpdate(
    id,
    taskAdminRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskAdminRequest** | **TaskAdminRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this task. | defaults to undefined|


### Return type

**TaskAdmin**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersCreate**
> User apiAdminUsersCreate(userRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    UserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let userRequest: UserRequest; //

const { status, data } = await apiInstance.apiAdminUsersCreate(
    userRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRequest** | **UserRequest**|  | |


### Return type

**User**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersDestroy**
> apiAdminUsersDestroy()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.apiAdminUsersDestroy(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No response body |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersList**
> PaginatedUserList apiAdminUsersList()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let pageSize: number; //Number of results to return per page. (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminUsersList(
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined|
| **pageSize** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|


### Return type

**PaginatedUserList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersMeRetrieve**
> User apiAdminUsersMeRetrieve()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

const { status, data } = await apiInstance.apiAdminUsersMeRetrieve();
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
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersOptionsPartialUpdate**
> User apiAdminUsersOptionsPartialUpdate()

Handler method for HTTP \'OPTIONS\' request.

### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    PatchedUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } = await apiInstance.apiAdminUsersOptionsPartialUpdate(
    patchedUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedUserRequest** | **PatchedUserRequest**|  | |


### Return type

**User**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersPartialUpdate**
> User apiAdminUsersPartialUpdate()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    PatchedUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } = await apiInstance.apiAdminUsersPartialUpdate(
    id,
    patchedUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patchedUserRequest** | **PatchedUserRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined|


### Return type

**User**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersRetrieve**
> User apiAdminUsersRetrieve()


### Example

```typescript
import {
    ApiAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.apiAdminUsersRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined|


### Return type

**User**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminUsersUpdate**
> User apiAdminUsersUpdate(userRequest)


### Example

```typescript
import {
    ApiAdminApi,
    Configuration,
    UserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ApiAdminApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let userRequest: UserRequest; //

const { status, data } = await apiInstance.apiAdminUsersUpdate(
    id,
    userRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRequest** | **UserRequest**|  | |
| **id** | [**number**] | A unique integer value identifying this user. | defaults to undefined|


### Return type

**User**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

