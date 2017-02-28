# browser-catch

An easier way to catch browser runtime console errors. With this tool you can automatically catch browser console errors during local development or on your ci.

It is built upon using selenium [browser logs](https://github.com/SeleniumHQ/selenium/wiki/Logging), the support for this is limited to [phantomjs using ghostdriver](https://github.com/detro/ghostdriver) and [chrome driver](https://sites.google.com/a/chromium.org/chromedriver/).

## Usage

This library provides a simple cli interface and you can also use it as an npm module around your own tooling.

### CLI

Using the cli interface is straight forward, first install the global npm module:

```
npm i browser-catch -g
```

Now you can specify the url on which to catch errors on, example:

```
browser-catch http://127.0.1.1:4555/throw
```

If there were errors you will see them like so:

```
{
    "start": 1486864288237,
    "end": 1486864288278,
    "url": "http://127.0.1.1:4555/throw",
    "driverType": "phantomjs",
    "errors": [
        {
            "level": "SEVERE",
            "message": "Error: A throw in js\n  global code (http://127.0.1.1:4555/throw:6)",
            "timestamp": 1486864288256
        }
    ]
}
✖ Error 1 console errors
```

To see all the available options run help:

```
browser-catch --help
```

### npm module

```
const { browserCatchUrl } = requrie('browser-catch')

browserCatchUrl('google.com')
    .then(results => {
        {
            //
        }
    })
    .catch(error => {
        // console errors from the url will not throw
        // instead errors in nodejs will throw, like the webdriverio client library
    })
```
