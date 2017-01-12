import { BROWSER_LOG_LEVELS, DRIVER_TYPES } from '../constants'
const webdriverio = require('webdriverio')

// http://webdriver.io/api/protocol/logTypes.html
const WEBDRIVER_BROWSER_LOG = 'browser'

const resolveWebdriverLogLevel = verbose => {
  if (verbose) {
    return 'verbose'
  } else {
    return 'silent'
  }
}

export function create (driverOptions, options) {
  // http://webdriver.io/guide/getstarted/configuration.html
  const webdriverOptions = Object.assign({},
    driverOptions,
    {logLevel: resolveWebdriverLogLevel(options.verbose)}
  )
  return webdriverio.remote(webdriverOptions)
}

export async function getBrowserLogs (client, options) {
  let logs = await attachLogs(client, options)
  return logs
}

function attachLogs (client, options) {
  return client
    .log(WEBDRIVER_BROWSER_LOG)
    .then(filterWarnings.bind(null, options))
}

export async function gotoUrl (client, url) {
  await client.url(url)
  let currentUrl = await client.getUrl()
  return validateUrl(url, currentUrl)
}

function validateUrl (expectedUrl, currentUrl) {
  // ugly check if the url loaded, must be a better way to do this??
  if (currentUrl === 'about:blank') {
    throw new Error(`\nThe url "${expectedUrl}" did not load, currentUrl is "${currentUrl}"\n`)
  }
}

function filterWarnings (options, logs) {
  let errors = []
  let driverType = options.driverType

  if (logs && logs.value) {
    // webdriver browser logs are inconsistent between browsers
    // in support and implementation :(
    if (driverType === DRIVER_TYPES.PHANTOMJS) {
      errors = filterGhostDriverBrowserLogs(logs.value)
      errors = filterSevereBrowserLogs(errors)
    } else {
      errors = filterSevereBrowserLogs(logs.value)
    }
  }

  return errors
}

function filterGhostDriverBrowserLogs (logs) {
  // Make phantom's logs level consistent with ChromeDriver
  // Errors are level WARNING instead of SEVERE
  return logs
    .map(log => {
      if (log.level === BROWSER_LOG_LEVELS.WARNING) {
        log.level = BROWSER_LOG_LEVELS.SEVERE
      }
      return log
    })
}

function filterSevereBrowserLogs (logs) {
  return logs.filter(log => log.level === BROWSER_LOG_LEVELS.SEVERE)
}
