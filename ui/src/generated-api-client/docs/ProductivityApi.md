# ProductivityApi

All URIs are relative to _http://localhost_

| Method                                            | HTTP request              | Description |
| ------------------------------------------------- | ------------------------- | ----------- |
| [**productivityRetrieve**](#productivityretrieve) | **GET** /api/productivity |             |

# **productivityRetrieve**

> productivityRetrieve()

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
