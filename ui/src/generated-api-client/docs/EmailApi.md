# EmailApi

All URIs are relative to _http://localhost_

| Method                                                | HTTP request                     | Description |
| ----------------------------------------------------- | -------------------------------- | ----------- |
| [**emailDailyDigestCreate**](#emaildailydigestcreate) | **POST** /api/email/daily-digest |             |

# **emailDailyDigestCreate**

> emailDailyDigestCreate()

Send daily digest emails and in-app notifications to all users. Triggered by Cloud Scheduler. Creates task_due / task_overdue notifications and sends digest emails.

### Example

```typescript
import { EmailApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new EmailApi(configuration);

const { status, data } = await apiInstance.emailDailyDigestCreate();
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
