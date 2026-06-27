# DashboardApi

All URIs are relative to _http://localhost_

| Method                                      | HTTP request           | Description |
| ------------------------------------------- | ---------------------- | ----------- |
| [**dashboardRetrieve**](#dashboardretrieve) | **GET** /api/dashboard |             |

# **dashboardRetrieve**

> dashboardRetrieve()

### Example

```typescript
import { DashboardApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

const { status, data } = await apiInstance.dashboardRetrieve();
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
