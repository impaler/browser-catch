# browser-catch

An easier way to catch browser runtime console errors. With this tool you can automatically catch browser console errors during local development or on your ci.

It is built upon using selenium [browser logs](https://github.com/SeleniumHQ/selenium/wiki/Logging), the support for this is limited to [phantomjs using ghostdriver](https://github.com/detro/ghostdriver) and [chrome driver](https://sites.google.com/a/chromium.org/chromedriver/).

## Usage

This library can be used through a cli interface or as a regular an npm module.

### CLI

Using the cli interface is straight forward, if you want to use it globablly you can install it as a global npm module:

```
npm i browser-catch -g
```

This adds the `browser-catch` bin to your `PATH`, so now you can easily check for errors on any url, for example:

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
    "errorCount": 1,
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

#### cli help
To see all the available options run help:

```
browser-catch --help
```

#### Config file

Being able to use this tool from a custom config file lets you easily integrate this tool into a local development workflow or a ci task. 

You can either create urls dynamically in a javascript file or provide a json file. For example, create a new file, eg `custom-config.js`:

```
export default {
  urls: [
    'http://awesomeapp',
    'http://awesomeapp/about',
    'http://awesomeapp/contact',
    'http://awesomeapp/cart',
  ]
}
```

You can run this from the cli tool directly:

```shell
browser-catch custom-config.js
```

### npm module

This library can also be used easily as any other npm module:

```shell
npm i browser-catch
```

The main part of the public api is based on `browserCatchUrl`.

```
const { browserCatchUrl } = requrie('browser-catch')

browserCatchUrl('google.com')
    .then(results => {
        // results.errors [...] contain all console errors
        // results.errorCount Number total console error
    })
    .catch(error => {
        // this throws only when there is an issue with webdriver, like an invalid url
    })
```

When a console error in the browser the url the library will not throw an error. Instead it will return an object that contains the error messages. It will however throw if there is an error in attempting to get these console errors. For example, if there is an invalid url it will throw an error.
