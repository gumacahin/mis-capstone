# CommentsApi

All URIs are relative to _http://localhost_

| Method                                              | HTTP request                   | Description |
| --------------------------------------------------- | ------------------------------ | ----------- |
| [**commentsCreate**](#commentscreate)               | **POST** /api/comments/        |             |
| [**commentsDestroy**](#commentsdestroy)             | **DELETE** /api/comments/{id}/ |             |
| [**commentsList**](#commentslist)                   | **GET** /api/comments/         |             |
| [**commentsPartialUpdate**](#commentspartialupdate) | **PATCH** /api/comments/{id}/  |             |
| [**commentsRetrieve**](#commentsretrieve)           | **GET** /api/comments/{id}/    |             |
| [**commentsUpdate**](#commentsupdate)               | **PUT** /api/comments/{id}/    |             |

# **commentsCreate**

> Comment commentsCreate(commentRequest)

### Example

```typescript
import { CommentsApi, Configuration, CommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let commentRequest: CommentRequest; //

const { status, data } = await apiInstance.commentsCreate(commentRequest);
```

### Parameters

| Name               | Type               | Description | Notes |
| ------------------ | ------------------ | ----------- | ----- |
| **commentRequest** | **CommentRequest** |             |       |

### Return type

**Comment**

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

# **commentsDestroy**

> commentsDestroy()

### Example

```typescript
import { CommentsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)

const { status, data } = await apiInstance.commentsDestroy(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this comment. | defaults to undefined |

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

# **commentsList**

> PaginatedCommentList commentsList()

### Example

```typescript
import { CommentsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)
let task: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.commentsList(page, task);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |
| **task** | [**string**] |                                                | (optional) defaults to undefined |

### Return type

**PaginatedCommentList**

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

# **commentsPartialUpdate**

> Comment commentsPartialUpdate()

### Example

```typescript
import { CommentsApi, Configuration, PatchedCommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)
let patchedCommentRequest: PatchedCommentRequest; // (optional)

const { status, data } = await apiInstance.commentsPartialUpdate(
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

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentsRetrieve**

> Comment commentsRetrieve()

### Example

```typescript
import { CommentsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)

const { status, data } = await apiInstance.commentsRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                      | Notes                 |
| ------ | ------------ | ------------------------------------------------ | --------------------- |
| **id** | [**number**] | A unique integer value identifying this comment. | defaults to undefined |

### Return type

**Comment**

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

# **commentsUpdate**

> Comment commentsUpdate(commentRequest)

### Example

```typescript
import { CommentsApi, Configuration, CommentRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new CommentsApi(configuration);

let id: number; //A unique integer value identifying this comment. (default to undefined)
let commentRequest: CommentRequest; //

const { status, data } = await apiInstance.commentsUpdate(id, commentRequest);
```

### Parameters

| Name               | Type               | Description                                      | Notes                 |
| ------------------ | ------------------ | ------------------------------------------------ | --------------------- |
| **commentRequest** | **CommentRequest** |                                                  |                       |
| **id**             | [**number**]       | A unique integer value identifying this comment. | defaults to undefined |

### Return type

**Comment**

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
