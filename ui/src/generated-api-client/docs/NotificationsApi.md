# NotificationsApi

All URIs are relative to _http://localhost_

| Method                                                                    | HTTP request                             | Description |
| ------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| [**notificationsCreate**](#notificationscreate)                           | **POST** /api/notifications/             |             |
| [**notificationsList**](#notificationslist)                               | **GET** /api/notifications/              |             |
| [**notificationsPartialUpdate**](#notificationspartialupdate)             | **PATCH** /api/notifications/{id}/       |             |
| [**notificationsReadAllCreate**](#notificationsreadallcreate)             | **POST** /api/notifications/read_all/    |             |
| [**notificationsReadCreate**](#notificationsreadcreate)                   | **POST** /api/notifications/{id}/read/   |             |
| [**notificationsRetrieve**](#notificationsretrieve)                       | **GET** /api/notifications/{id}/         |             |
| [**notificationsUnreadCountRetrieve**](#notificationsunreadcountretrieve) | **GET** /api/notifications/unread_count/ |             |

# **notificationsCreate**

> Notification notificationsCreate()

### Example

```typescript
import { NotificationsApi, Configuration, NotificationRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let notificationRequest: NotificationRequest; // (optional)

const { status, data } =
  await apiInstance.notificationsCreate(notificationRequest);
```

### Parameters

| Name                    | Type                    | Description | Notes |
| ----------------------- | ----------------------- | ----------- | ----- |
| **notificationRequest** | **NotificationRequest** |             |       |

### Return type

**Notification**

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

# **notificationsList**

> PaginatedNotificationList notificationsList()

### Example

```typescript
import { NotificationsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let page: number; //A page number within the paginated result set. (optional) (default to undefined)

const { status, data } = await apiInstance.notificationsList(page);
```

### Parameters

| Name     | Type         | Description                                    | Notes                            |
| -------- | ------------ | ---------------------------------------------- | -------------------------------- |
| **page** | [**number**] | A page number within the paginated result set. | (optional) defaults to undefined |

### Return type

**PaginatedNotificationList**

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

# **notificationsPartialUpdate**

> Notification notificationsPartialUpdate()

### Example

```typescript
import {
  NotificationsApi,
  Configuration,
  PatchedNotificationRequest,
} from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let id: number; //A unique integer value identifying this notification. (default to undefined)
let patchedNotificationRequest: PatchedNotificationRequest; // (optional)

const { status, data } = await apiInstance.notificationsPartialUpdate(
  id,
  patchedNotificationRequest,
);
```

### Parameters

| Name                           | Type                           | Description                                           | Notes                 |
| ------------------------------ | ------------------------------ | ----------------------------------------------------- | --------------------- |
| **patchedNotificationRequest** | **PatchedNotificationRequest** |                                                       |                       |
| **id**                         | [**number**]                   | A unique integer value identifying this notification. | defaults to undefined |

### Return type

**Notification**

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

# **notificationsReadAllCreate**

> Notification notificationsReadAllCreate()

### Example

```typescript
import { NotificationsApi, Configuration, NotificationRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let notificationRequest: NotificationRequest; // (optional)

const { status, data } =
  await apiInstance.notificationsReadAllCreate(notificationRequest);
```

### Parameters

| Name                    | Type                    | Description | Notes |
| ----------------------- | ----------------------- | ----------- | ----- |
| **notificationRequest** | **NotificationRequest** |             |       |

### Return type

**Notification**

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

# **notificationsReadCreate**

> Notification notificationsReadCreate()

### Example

```typescript
import { NotificationsApi, Configuration, NotificationRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let id: number; //A unique integer value identifying this notification. (default to undefined)
let notificationRequest: NotificationRequest; // (optional)

const { status, data } = await apiInstance.notificationsReadCreate(
  id,
  notificationRequest,
);
```

### Parameters

| Name                    | Type                    | Description                                           | Notes                 |
| ----------------------- | ----------------------- | ----------------------------------------------------- | --------------------- |
| **notificationRequest** | **NotificationRequest** |                                                       |                       |
| **id**                  | [**number**]            | A unique integer value identifying this notification. | defaults to undefined |

### Return type

**Notification**

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

# **notificationsRetrieve**

> Notification notificationsRetrieve()

### Example

```typescript
import { NotificationsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let id: number; //A unique integer value identifying this notification. (default to undefined)

const { status, data } = await apiInstance.notificationsRetrieve(id);
```

### Parameters

| Name   | Type         | Description                                           | Notes                 |
| ------ | ------------ | ----------------------------------------------------- | --------------------- |
| **id** | [**number**] | A unique integer value identifying this notification. | defaults to undefined |

### Return type

**Notification**

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

# **notificationsUnreadCountRetrieve**

> Notification notificationsUnreadCountRetrieve()

### Example

```typescript
import { NotificationsApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

const { status, data } = await apiInstance.notificationsUnreadCountRetrieve();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**Notification**

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
