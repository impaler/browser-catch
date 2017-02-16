export function stripDefaultReporterHack (stdout, port) {
// A very hacky way to very the cli api for a smoke testing
// to use the snapshot diffing for expected output,
// e2e tests need to verify stdout without the unique
// timestamps, port and invalid json chars
// todo integrate some of the replacements from the reporter

  stdout = stdout.replace('[32m', '')
  stdout = stdout.replace('[34m', '')
  stdout = stdout.replace('[37m', '')
  stdout = stdout.replace('[39m', '')
  stdout = stdout.replace('✔ Pass no console errors[39m', '')
  stdout = stdout.replace('\u001b[31m✖ Error 2 console errors\u001b[39m', '')
  try {
    let result = JSON.parse(stdout)
    if (Array.isArray(result)) {
      result = result.map(item => stripTimestamps(item.result, port))
    } else {
      result = stripTimestamps(result, port)
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

function stripTimestamps (stdout, port) {
  delete stdout.end
  delete stdout.start
  delete stdout.url

  stdout.errors = stdout.errors.map(error => {
    delete error.timestamp
    error.message = error.message.replace(port, '9999')
    return error
  })

  return stdout
}
