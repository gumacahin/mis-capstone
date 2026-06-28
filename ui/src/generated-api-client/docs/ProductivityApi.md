# ProductivityApi

All URIs are relative to _http://localhost_

| Method                                            | HTTP request              | Description |
| ------------------------------------------------- | ------------------------- | ----------- |
| [**productivityRetrieve**](#productivityretrieve) | **GET** /api/productivity |             |

# **productivityRetrieve**

> UserProductivity productivityRetrieve()

### Example

```typescript
import { ProductivityApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new ProductivityApi(configuration);

const { status, data } = await apiInstance.productivityRetrieve();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**UserProductivity**

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
