export function stripDefaultReporterHack (stdout, options) {
// A very hacky way to very the cli api for a smoke testing
// to use the snapshot diffing for expected output,
// e2e tests need to verify stdout without the unique
// timestamps, port and invalid json chars
// todo integrate some of the replacements from the reporter
  let port = options.port

  stdout = stdout.replace('[32m', '')
  stdout = stdout.replace('[34m', '')
  stdout = stdout.replace('[37m', '')
  stdout = stdout.replace('[39m', '')
  stdout = stdout.replace('✔ Pass no console errors[39m', '')
  stdout = stdout.replace('\u001b[31m✖ Error 2 console errors\u001b[39m', '')

  let result
  try {
    result = JSON.parse(stdout)
    return stripResult(result, port)
  } catch (error) {
    throw error
  }
}

export function stripResult (result, port) {
  let strippedResult = Object.assign({}, result)
  if (Array.isArray(strippedResult)) {
    strippedResult = stripResults(strippedResult, port)
  } else {
    strippedResult = stripTimestamps(strippedResult, port)
  }
  return strippedResult
}

export function stripResults (results, port) {
  return results.map(result => stripResult(result, port))
}

function stripTimestamps (result, port) {
  delete result.end
  delete result.start
  delete result.url

  if (result.errors) {
    result.errors = result.errors.map(error => {
      delete error.timestamp
      error.message = error.message.replace(port, '9999')
      return error
    })
  } else if (result.message) {
    result = {message: result.message}
  }

  return result
}
