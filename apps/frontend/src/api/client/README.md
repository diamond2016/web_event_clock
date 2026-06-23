## @it.diamondnet/web-event-clock@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @it.diamondnet/web-event-clock@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**apiHealthGet**](docs/DefaultApi.md#apihealthget) | **GET** /api/health | Health check
*DefaultApi* | [**apiPublishChannelPost**](docs/DefaultApi.md#apipublishchannelpost) | **POST** /api/publish/{channel} | Publish a time event to a channel
*DefaultApi* | [**apiSetClockPost**](docs/DefaultApi.md#apisetclockpost) | **POST** /api/set.clock | Set the main clock (absolute mode)
*DefaultApi* | [**apiStartTimerPost**](docs/DefaultApi.md#apistarttimerpost) | **POST** /api/start.timer | Start the timer (relative mode)
*DefaultApi* | [**apiStopTimerPost**](docs/DefaultApi.md#apistoptimerpost) | **POST** /api/stop.timer | Stop the timer
*DefaultApi* | [**apiSubscribeChannelPost**](docs/DefaultApi.md#apisubscribechannelpost) | **POST** /api/subscribe/{channel} | Subscribe to a clock event channel
*DefaultApi* | [**apiUnsubscribeChannelPost**](docs/DefaultApi.md#apiunsubscribechannelpost) | **POST** /api/unsubscribe/{channel} | Unsubscribe from a clock event channel


### Documentation For Models

 - [ClockChannel](docs/ClockChannel.md)
 - [ResponsePayload](docs/ResponsePayload.md)
 - [SetRequestPayload](docs/SetRequestPayload.md)
 - [SetResponsePayload](docs/SetResponsePayload.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

