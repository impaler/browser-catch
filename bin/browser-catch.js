#!/usr/bin/env node

const program = require('commander')
const parseIntDefault = (val) => parseInt(val, 10) // current issue with commander

const browserCatch = require('../dist').browserCatch
const assignDefaultOptions = require('../dist').assignDefaultOptions
const DEFAULT_OPTIONS = require('../dist/constants').DEFAULT_OPTIONS
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
  .option('-j, --json', 'output only json of the result to stdout', DEFAULT_OPTIONS.json)
  .option('-v, --verbose', 'verbose level logging to stdout', DEFAULT_OPTIONS.verbose)
  .option('-f, --wait-for-exist <selector>', 'wait for an element (selected by css selector) for the provided amount of milliseconds to be present within the DOM', DEFAULT_OPTIONS.waitForExist)
  .option(`--wait-for-exist-reverse`, 'waits for the selector to NOT exist in the DOM', DEFAULT_OPTIONS.waitForExistReverse)
  .option('--wait-for-exist-ms <ms>', 'the duration  in milliseconds for the wait-for-exist option to wait', parseIntDefault, DEFAULT_OPTIONS.waitForExistMs)
  .option('-p, --pause <ms>', 'in milliseconds, pause for errors to occur', parseIntDefault, DEFAULT_OPTIONS.pause)
  .option('-r, --run <path>', 'run a js script with the context of the running webdriver client', DEFAULT_OPTIONS.run)
  .option('-w, --webdriver-host <url>', 'set the a specific webdriver host', DEFAULT_OPTIONS.webdriverHost)
  .option('-P, --webdriver-port <port>', 'set a custom selenium port', DEFAULT_OPTIONS.webdriverPort)
  .option('-d, --driver-type <type>', 'the browser driver to run, chrome and phantomjs are known to work', DEFAULT_OPTIONS.driverType)
  .parse(process.argv)

if (program.args.length > 0) {
  const firstArgument = parseFirstArgument(program.args[0])
  const options = assignDefaultOptions(program)

  if (options.verbose) console.log(`
Running browser-catch with command options:
${JSON.stringify(options, null, 2)}
`)

  browserCatch(firstArgument, options)
    .then(onDone.bind(null, options))
    .catch(onError)
} else {
  program.outputHelp()
  reporter.handledError('Error, you must at least include a url as an argument\n')
  process.exit(1)
}

function onDone (options, result) {
  if(Array.isArray(result)) { //errors??
    result = result.map(item => {
      delete item.options
      return item
    })
  } else {
    delete result.options
  }

  reporter.report(result, options)

  const errorCount = reporter.countErrors(result)
  process.exit(errorCount)
}

function onError (error) {
  reporter.unhandledError(error)
  process.exit(1)
}

function parseFirstArgument (argument) {
  var result = {}

  if (/\.js$|\.json$/.test(argument)) {
    result = {
      type: 'config',
      path: argument
    }
  } else if (!/^http[s]?:\/\//.test(argument)) {
    result = {
      type: 'url',
      url: 'http://' + argument
    }
  } else {
    result = {
      type: 'url',
      url: argument
    }
  }
  return result
}
