import test from 'ava'

import fixtureServer from './fixtures/server/server'
import { browserCatchUrls } from '../src/index'
import { stripResults } from './helpers/result'

const DRIVER_TYPE = 'phantomjs'

test('catching 1 error from two urls', async t => {
  const serverSettings = await fixtureServer()
  const urls = [
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
  ]
  const results = await browserCatchUrls(urls)
  const snapshot = stripResults(results, serverSettings.port)

  for (let result of results) {
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  t.snapshot(snapshot)
})
