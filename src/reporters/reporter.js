const colors = require('ansicolors')

const defaultReporter = require('./default-reporter')

export function report (result, options) {

  if (options.json) {
    console.log(JSON.stringify(result, null, 4))
  } else {
    defaultReporter.report(result)
  }
}

export function unhandledError (error) {
  console.error(colors.red('\nunhandledError:'))
  console.error(colors.red(error))
}

export function handledError (message) {
  console.error(colors.red(message))
}

export function countErrors(result) {
  var errorCount

  if (Array.isArray(result)) {
    var errorResults = result
      .map(item => item.errors)
      .reduce((a, b) => a.concat(b))

    errorCount = errorResults.length

  } else {
    errorCount = result.errors.length
  }

  return errorCount
}
