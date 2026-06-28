# TagsApi

All URIs are relative to _http://localhost_

| Method                                      | HTTP request                 | Description |
| ------------------------------------------- | ---------------------------- | ----------- |
| [**tagsCreate**](#tagscreate)               | **POST** /api/tags/          |             |
| [**tagsDestroy**](#tagsdestroy)             | **DELETE** /api/tags/{slug}/ |             |
| [**tagsList**](#tagslist)                   | **GET** /api/tags/           |             |
| [**tagsPartialUpdate**](#tagspartialupdate) | **PATCH** /api/tags/{slug}/  |             |
| [**tagsRetrieve**](#tagsretrieve)           | **GET** /api/tags/{slug}/    |             |
| [**tagsUpdate**](#tagsupdate)               | **PUT** /api/tags/{slug}/    |             |

# **tagsCreate**

> Tag tagsCreate(tagRequest)

### Example

```typescript
import { TagsApi, Configuration, TagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagRequest: TagRequest; //

const { status, data } = await apiInstance.tagsCreate(tagRequest);
```

### Parameters

| Name           | Type           | Description | Notes |
| -------------- | -------------- | ----------- | ----- |
| **tagRequest** | **TagRequest** |             |       |

### Return type

**Tag**

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

# **tagsDestroy**

> tagsDestroy()

### Example

```typescript
import { TagsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.tagsDestroy(slug);
```

### Parameters

| Name     | Type         | Description | Notes                 |
| -------- | ------------ | ----------- | --------------------- |
| **slug** | [**string**] |             | defaults to undefined |

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

# **tagsList**

> PaginatedTagList tagsList()

### Example

```typescript
import { TagsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.tagsList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedTagList**

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

# **tagsPartialUpdate**

> Tag tagsPartialUpdate()

### Example

```typescript
import { TagsApi, Configuration, PatchedTagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let slug: string; // (default to undefined)
let patchedTagRequest: PatchedTagRequest; // (optional)

const { status, data } = await apiInstance.tagsPartialUpdate(
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

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth), [jwtAuth](../README.md#jwtAuth), [E2ETestBearer](../README.md#E2ETestBearer)

### HTTP request headers

- **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagsRetrieve**

> TagDetail tagsRetrieve()

### Example

```typescript
import { TagsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.tagsRetrieve(slug);
```

### Parameters

| Name     | Type         | Description | Notes                 |
| -------- | ------------ | ----------- | --------------------- |
| **slug** | [**string**] |             | defaults to undefined |

### Return type

**TagDetail**

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

# **tagsUpdate**

> Tag tagsUpdate(tagRequest)

### Example

```typescript
import { TagsApi, Configuration, TagRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let slug: string; // (default to undefined)
let tagRequest: TagRequest; //

const { status, data } = await apiInstance.tagsUpdate(slug, tagRequest);
```

### Parameters

| Name           | Type           | Description | Notes                 |
| -------------- | -------------- | ----------- | --------------------- |
| **tagRequest** | **TagRequest** |             |                       |
| **slug**       | [**string**]   |             | defaults to undefined |

### Return type

**Tag**

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
