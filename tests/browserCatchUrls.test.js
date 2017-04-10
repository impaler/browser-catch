import test from 'ava'

import fixtureServer from './fixtures/server/server'
import { catchUrls } from '../src/index'
import { stripResults } from './helpers/result'

const DRIVER_TYPE = 'phantomjs'

test('catching 4 errors from 4 urls', async t => {
  const serverSettings = await fixtureServer()
  const urls = [
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error`,
  ]
  const urlsResults = await catchUrls(urls)
  t.is(urlsResults.errorCount, 4)

  for (let result of urlsResults.results) {
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  const snapshot = stripResults(urlsResults.results, serverSettings.port)
  t.snapshot(snapshot)
})

test('catching 34 errors from different urls', async t => {
  const serverSettings = await fixtureServer()
  const urls = [
    `${serverSettings.url}/error?count=20`,
    `${serverSettings.url}/error`,
    `${serverSettings.url}/error?count=12`,
    `${serverSettings.url}/error`,
  ]
  const urlsResults = await catchUrls(urls)
  t.is(urlsResults.errorCount, 34)

  for (let result of urlsResults.results) {
    t.is(result.driverType, DRIVER_TYPE)
  }

  const snapshot = stripResults(urlsResults.results, serverSettings.port)
  t.snapshot(snapshot)
})

test('throwing on any invalid urls', async t => {
  const urls = [
    `http://unconscious/error?count=20`,
    `http://unconscious/error?count=20`
  ]
  const error = await t.throws(catchUrls(urls))
  t.snapshot(error)
})
