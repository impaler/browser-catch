const { seriesSettled } = require('promise-sequences')

import loadDriver from './drivers/driver'
import { CONFIG_TYPE, DEFAULT_OPTIONS } from './constants'
import { readFile, readFileBabel } from './lib/script-loader'
import { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
export { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'

export async function browserCatch (task, options) {
  if (task.type === CONFIG_TYPE.url) {
    return browserCatchUrl(task.url, options)
  } else if (task.type === CONFIG_TYPE.config) {
    return browserCatchConfig(task.path, options)
  } else {
    throw new Error(`browserCatch unknown task TYPE, please specify a type such as ${Object.keys(CONFIG_TYPE)}`)
  }
}

export async function browserCatchConfig (configPath, options) {
  let config = await readFile(configPath)

  if (config && config.urls) {
    let results = await browserCatchUrls(config.urls, options)
    return results
  } else {
    throw new Error('browserCatchConfig you need to provide a config["urls"] array in your config object')
  }
}

export async function browserCatchUrls (urls, options) {
  options = assignDefaultOptions(options)

  if (!Array.isArray(urls) || urls.length <= 0) {
    throw new Error('browserCatchUrls expects an array of urls with a length greater than 1')
  }

  let results

  let tasks = urls.map(url => () => browserCatchUrl(url, options))
  results = await seriesSettled(tasks, options.concurrent)
  let errors = results.filter(result => result.state !== 'resolved')

  if (errors.length > 0) {
    if (options.verbose) {
      console.log(`There were ${errors.length} errors in the task`)
      errors.forEach(error => console.error(error))
    }
    throw errors
  } else {
    results = results.map(result => result.result)
    return results
  }
}

export async function browserCatchUrl (url, options) {
  options = assignDefaultOptions(options)
  let driver

  try {
    if (options.verbose) console.log(`Creating webdriver client`)

    driver = await loadDriver(options)
    let client = create(driver.webdriverOptions, options)
    await client.init()

    if (options.verbose) console.log(`Webdriver client created using .gotoUrl ${url}`)

    let start = Date.now()
    await gotoUrl(client, url)

    if (options.run) {
      let script = await loadScript(options.run, options)
      await runScript(script, client, options)
    }

    // http://webdriver.io/api/utility/waitForExist.html
    if (options.waitForExist) {
      if (options.verbose) {
        console.log(`
Now waitForExist selector ${options.waitForExist} 
for ${options.waitForExistMs}ms & reverse ${options.waitForExistReverse}
`)
      }
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
      url: url,
      driverType: options.driverType,
      errors,
      options,
    }
  } catch (error) {
    if (driver) driver.kill()

    throw error
  }
}

export function assignDefaultOptions (options) {
  let assigned = Object.assign({}, DEFAULT_OPTIONS, options)
  if (assigned.verbose) console.log(assigned)
  return assigned
}

async function runScript (script, client, options) {
  try {
    await script(client, options)
  } catch (error) {
    if (options.verbose) console.error(`custom script has thrown an error`, error)
    throw error
  }
}

async function loadScript (scriptPath, options) {
  if (options.verbose) console.log(`Loading run script from path ${options.run}`)

  let customScript

  try {
    customScript = await readFileBabel(scriptPath)
  } catch (error) {
    console.error(`Could not load script your --run option ${scriptPath}`)
    throw error
  }

  return customScript
}
