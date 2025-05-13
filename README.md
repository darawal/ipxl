# ipxl
This package can be used to include [isima](http://isima.io/) pixel in your  website or app ([React](https://reactjs.org/), [Angular](https://angular.io/) etc) for tracking user interaction.

# Installation

### Manually
Simply include ```ipxl.min.js``` in the ```<head>```.

```html
<head>
  ...
    <script src="ipxl.min.js" />
  ...
</head>
```
If you downloaded the package via zip file from Github, these files are located in the dist folder. Otherwise, you can use the CDN.

### Via NPM

```markdown
npm install ipxl
```
### Via Yarn

```markdown
yarn add ipxl
```

# Features:
1. Easy to use API
2. Custom schema management
3. Automatic Device Recognition
4. Script and ES6 support
5. Dashboard reports
6. Event batching with custom setting

# Quick Start
Create required signal, context and webhook source. Connect signal and context using flows.
For any help, Please [Contact Us](mailto:imagine@isima.io)

### Add tracking 
Please note down the `webhook source endpoint` that would be something like this `https://bios.isima.io/integration/<tenant>/ipxl` 

### using Script

```markdown
    <script src="../node_modules/ipxl/dist/ipxl.min.js"></script>
    <script>
        const pixel = ipxl.default;
        pixel.initialize({
            endpoint: <webhook-endpoint>
        });
    </script>
```

### Using ES6 
```markdown
    import ipxl from 'ipxl';
    
     pixel.initialize({
        endpoint: "https://bios.isima.io/integration/isima/ipxl"
    });
```


# API
### 1. pixel.initialize({endpoint, options})
```endpoint : integration endpoint for pushing data```

### options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| debug | Boolean | false | Show/hide console debug information |
| queueCapacity | number | 20 | max number of events that can be queued |
| queueInterval | number | 60(seconds) | max number of seconds for which data can be queued |

### 2. pixel.userClicks(payload)
### payload

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| pageURL | String | Yes | Page url with query param |
| pageTitle | String | Yes | Page Title |
| pageDomain | String | Yes | Domain hostname |
| eventLabel | String | Yes | event Label |

### payload example:

```JS
    {
        pageURL: "https://example.com/cart",
        pageTitle: "Example Domain",
        pageDomain: "https://example.com/",
        eventLabel: "Add to cart",
        ...restCustomPayload
    }
```
### 3. pixel.userException(payload)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| pageURL | String | Yes | Page url with query param |
| pageTitle | String | Yes | Page Title |
| pageDomain | String | Yes | Domain hostname |
| exceptionType | String | Yes | Type of exception |
| errorText | String | Yes | Error text |

```js
{
    pageURL: "https://example.com/cart",
    pageTitle: "Example Domain",
    pageDomain: "https://example.com/",
    exceptionType: "ReferenceError",
    errorText: "foo is not defined",
    ...restCustomPayload
}
```

# Limits
There are limits on maximum number of allowed attributes **MAX_ALLOWED_ATTRIBUTES_COUNT** of 30 in any single event. Also, a single event  size **MAX_ALLOWED_EVENT_SIZE** cannot be larger than 50Kb.   