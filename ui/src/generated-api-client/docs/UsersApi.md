# UsersApi

All URIs are relative to _http://localhost_

| Method                                                      | HTTP request                          | Description |
| ----------------------------------------------------------- | ------------------------------------- | ----------- |
| [**usersCreate**](#userscreate)                             | **POST** /api/users/                  |             |
| [**usersDeleteAccountDestroy**](#usersdeleteaccountdestroy) | **DELETE** /api/users/delete_account/ |             |
| [**usersDestroy**](#usersdestroy)                           | **DELETE** /api/users/{id}/           |             |
| [**usersList**](#userslist)                                 | **GET** /api/users/                   |             |
| [**usersMeRetrieve**](#usersmeretrieve)                     | **GET** /api/users/me/                |             |
| [**usersOptionsPartialUpdate**](#usersoptionspartialupdate) | **PATCH** /api/users/options/         |             |
| [**usersPartialUpdate**](#userspartialupdate)               | **PATCH** /api/users/{id}/            |             |
| [**usersRetrieve**](#usersretrieve)                         | **GET** /api/users/{id}/              |             |
| [**usersUpdate**](#usersupdate)                             | **PUT** /api/users/{id}/              |             |

# **usersCreate**

> User usersCreate(userRequest)

### Example

```typescript
import { UsersApi, Configuration, UserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userRequest: UserRequest; //

const { status, data } = await apiInstance.usersCreate(userRequest);
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

# **usersDeleteAccountDestroy**

> usersDeleteAccountDestroy()

### Example

```typescript
import { UsersApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.usersDeleteAccountDestroy();
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
| **204**     | No response body | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersDestroy**

> usersDestroy()

### Example

```typescript
import { UsersApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.usersDestroy(id);
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

# **usersList**

> PaginatedUserList usersList()

### Example

```typescript
import { UsersApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.usersList(page);
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

# **usersMeRetrieve**

> User usersMeRetrieve()

### Example

```typescript
import { UsersApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.usersMeRetrieve();
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

# **usersOptionsPartialUpdate**

> User usersOptionsPartialUpdate()

Handler method for HTTP \'OPTIONS\' request.

### Example

```typescript
import { UsersApi, Configuration, PatchedUserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } =
  await apiInstance.usersOptionsPartialUpdate(patchedUserRequest);
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

# **usersPartialUpdate**

> User usersPartialUpdate()

### Example

```typescript
import { UsersApi, Configuration, PatchedUserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let patchedUserRequest: PatchedUserRequest; // (optional)

const { status, data } = await apiInstance.usersPartialUpdate(
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

# **usersRetrieve**

> User usersRetrieve()

### Example

```typescript
import { UsersApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)

const { status, data } = await apiInstance.usersRetrieve(id);
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

# **usersUpdate**

> User usersUpdate(userRequest)

### Example

```typescript
import { UsersApi, Configuration, UserRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //A unique integer value identifying this user. (default to undefined)
let userRequest: UserRequest; //

const { status, data } = await apiInstance.usersUpdate(id, userRequest);
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
