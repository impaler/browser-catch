const defaultReporter = require('./default-reporter')
const colors = require('ansicolors')

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
