import loadDriver from './drivers/driver'
import { create, getBrowserLogs } from './client/webdriverio-log'
export { create, getBrowserLogs } from './client/webdriverio-log'

export async function browserCatchUrl (url, options) {
  let driver

  try {
    driver = await loadDriver(options)

    let client = create(driver.webdriverOptions, options)
    let start = Date.now()
    let errors = await getBrowserLogs(url, client, options)
    let end = Date.now()

    driver.kill()

    return {
      start,
      end,
      url,
      driverType: options.driverType,
      errors
    }
  } catch (error) {
    if (driver) driver.kill()

    throw error
  }
}
