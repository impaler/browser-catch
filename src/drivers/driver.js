import phantomDriver from './phantom-driver'

export default async function (options) {
  let driver
  let webdriverHost = options.webdriverHost
  let webdriverPort = options.webdriverPort

  if (options.driverType === 'phantomjs') {
    driver = await phantomDriver(options)
  } else {
    driver = {
      driverType: options.driverType,
      webdriverOptions: {
        desiredCapabilities: {
          browserName: options.driverType
        },
        host: webdriverHost,
        port: webdriverPort
      },
      kill: () => { }
    }
  }

  return driver
}
