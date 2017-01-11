import loadDriver from './drivers/driver'
import { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
export { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'

export async function browserCatchUrl (url, options) {
  let driver

  try {
    if (options.verbose) console.log(`Creating webdriver client`)

    driver = await loadDriver(options)
    let client = create(driver.webdriverOptions, options)
    await client.init()

    if (options.verbose) console.log(`Webdriver client created using .gotoUrl ${url}`)

    let start = Date.now()
    await gotoUrl(client, url)

    // http://webdriver.io/api/utility/waitForExist.html
    if (options.waitForExist) {
      if (options.verbose) console.log(`
Now waitForExist selector ${options.waitForExist} 
for ${options.waitForExistMs}ms & reverse ${options.waitForExistReverse}
`)
      await client.waitForExist(
        options.waitForExist,
        options.waitForExistMs,
        options.waitForExistReverse
      )
    }

    if (options.pause) {
      if (options.verbose) console.log(`Starting to pause for ${options.pause}ms`)
      await client.pause(options.pause)
    }

    let errors = await getBrowserLogs(client, options)

    let end = Date.now()
    await client.end()
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
