#!/usr/bin/env node

const program = require('commander')
const parseIntDefault = (val) => parseInt(val, 10) // current issue with commander

require('babel-polyfill')

const browserCatchUrl = require('../dist').browserCatchUrl
const reporter = require('../dist/reporters/reporter')
const packageMetaData = require('../package.json')

program
  .version(packageMetaData.version)
  .arguments('<cmd> [env]')
  .description(`A utility to catch browser runtime console errors.
  
  version ${packageMetaData.version}
  
  Example:
  
    browser-catch google.com`)
  .usage('<url> [options]')
  .option('-j, --json', 'output only json of the result to stdout')
  .option('-v, --verbose', 'verbose level logging to stdout')
  .option('-f, --wait-for-exist <selector>', 'wait for an element (selected by css selector) for the provided amount of milliseconds to be present within the DOM')
  .option(`--wait-for-exist-reverse`, 'waits for the selector to NOT exist in the DOM')
  .option('--wait-for-exist-ms <ms>', 'the duration  in milliseconds for the wait-for-exist option to wait', parseIntDefault, 10000)
  .option('-p, --pause <ms>', 'in milliseconds, pause for errors to occur', parseIntDefault, 0)
  .option('-r, --run <path>', 'run a js script with the context of the running webdriver client', null)
  .option('-w, --webdriver-host <url>', 'set the a specific webdriver host', '127.0.0.1')
  .option('-P, --webdriver-port <port>', 'set a custom selenium port', 4444)
  .option('-d, --driver <type>', 'the browser driver to run, chrome and phantomjs are known to work', 'phantomjs')
  .parse(process.argv)

if (program.args.length > 0) {
  const url = parseUrl(program.args[0])

  const options = {
    pause: program.pause,
    webdriverHost: program.webdriverHost,
    webdriverPort: program.webdriverPort,
    driverType: program.driver,
    json: !!(program.json),
    verbose: !!(program.verbose),
    run: program.run,
    waitForExist: program.waitForExist || false,
    waitForExistMs: program.waitForExistMs,
    waitForExistReverse: !!(program.waitForExistReverse)
  }

  if(options.verbose) console.log(`
Running browser-catch with command options:
${JSON.stringify(options, null, 2)}
`)

  browserCatchUrl(url, options)
    .then(onDone.bind(null, options))
    .catch(onError)
} else {
  program.outputHelp()
  reporter.handledError('Error, you must at least include a url as an argument\n')
  process.exit(1)
}

function parseUrl (url) {
  if (url.search(/^http[s]?:\/\//) === -1) {
    url = 'http://' + url
  }
  return url
}

function onDone (options, result) {
  reporter.report(result, options)

  const errorCode = result.errors.length > 0 ? 1 : 0
  process.exit(errorCode)
}

function onError (error) {
  reporter.unhandledError(error)
  process.exit(1)
}
