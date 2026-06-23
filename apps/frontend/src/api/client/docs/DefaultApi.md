# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiHealthGet**](#apihealthget) | **GET** /api/health | Health check|
|[**apiPublishChannelPost**](#apipublishchannelpost) | **POST** /api/publish/{channel} | Publish a time event to a channel|
|[**apiSetClockPost**](#apisetclockpost) | **POST** /api/set.clock | Set the main clock (absolute mode)|
|[**apiStartTimerPost**](#apistarttimerpost) | **POST** /api/start.timer | Start the timer (relative mode)|
|[**apiStopTimerPost**](#apistoptimerpost) | **POST** /api/stop.timer | Stop the timer|
|[**apiSubscribeChannelPost**](#apisubscribechannelpost) | **POST** /api/subscribe/{channel} | Subscribe to a clock event channel|
|[**apiUnsubscribeChannelPost**](#apiunsubscribechannelpost) | **POST** /api/unsubscribe/{channel} | Unsubscribe from a clock event channel|

# **apiHealthGet**
> apiHealthGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.apiHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Service is healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiPublishChannelPost**
> SetResponsePayload apiPublishChannelPost(setRequestPayload)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetRequestPayload
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let channel: ClockChannel; // (default to undefined)
let setRequestPayload: SetRequestPayload; //

const { status, data } = await apiInstance.apiPublishChannelPost(
    channel,
    setRequestPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setRequestPayload** | **SetRequestPayload**|  | |
| **channel** | **ClockChannel** |  | defaults to undefined|


### Return type

**SetResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Publish result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiSetClockPost**
> SetResponsePayload apiSetClockPost(setRequestPayload)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetRequestPayload
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let setRequestPayload: SetRequestPayload; //

const { status, data } = await apiInstance.apiSetClockPost(
    setRequestPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setRequestPayload** | **SetRequestPayload**|  | |


### Return type

**SetResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Clock set result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiStartTimerPost**
> SetResponsePayload apiStartTimerPost(setRequestPayload)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetRequestPayload
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let setRequestPayload: SetRequestPayload; //

const { status, data } = await apiInstance.apiStartTimerPost(
    setRequestPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setRequestPayload** | **SetRequestPayload**|  | |


### Return type

**SetResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Timer start result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiStopTimerPost**
> SetResponsePayload apiStopTimerPost(setRequestPayload)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetRequestPayload
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let setRequestPayload: SetRequestPayload; //

const { status, data } = await apiInstance.apiStopTimerPost(
    setRequestPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setRequestPayload** | **SetRequestPayload**|  | |


### Return type

**SetResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Timer stop result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiSubscribeChannelPost**
> ResponsePayload apiSubscribeChannelPost()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let channel: ClockChannel; // (default to undefined)

const { status, data } = await apiInstance.apiSubscribeChannelPost(
    channel
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **channel** | **ClockChannel** |  | defaults to undefined|


### Return type

**ResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Subscription result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUnsubscribeChannelPost**
> ResponsePayload apiUnsubscribeChannelPost()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '@it.diamondnet/web-event-clock';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let channel: ClockChannel; // (default to undefined)

const { status, data } = await apiInstance.apiUnsubscribeChannelPost(
    channel
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **channel** | **ClockChannel** |  | defaults to undefined|


### Return type

**ResponsePayload**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Unsubscription result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

