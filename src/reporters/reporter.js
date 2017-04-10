const colors = require('ansicolors')

const defaultReporter = require('./default-reporter')

export function report (result, options) {
  let errorCount

  if (Array.isArray(result.results)) {
    errorCount = result.errorCount
    result = result.results.map(item => {
      delete item.options
      return item
    })
    for (let urlResult of result) {
      reportResult(urlResult, options)
    }
  } else {
    delete result.options
    errorCount = result.errors.length
    reportResult(result, options)
  }
  defaultReporter.report(errorCount)
}

function reportResult (result, options) {
  if (options.json) {
    console.log(JSON.stringify(result, null, 4))
  } else {
    defaultReporter.reportSingle(result)
  }
}

export function unhandledError (error) {
  console.error(colors.red(error))
}

export function handledError (message) {
  console.error(colors.red(message))
}

export function countErrors (result) {
  return result.errorCount ? result.errorCount : result.errors.length
}
