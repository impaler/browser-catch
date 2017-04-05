import test from 'ava'

import fixtureServer from './fixtures/server/server'
import { browserCatchConfig } from '../src/index'
import { stripResult } from './helpers/result'
import { writeTempJSFile, writeTempJSONFile } from './helpers/io'

const DRIVER_TYPE = 'phantomjs'

test('running a config in es6 with an array of urls', async t => {
  const serverSettings = await fixtureServer()
  const configPath = await writeTempJSFile({
    urls: [
      `${serverSettings.url}/error`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`,
    ]
  }, 'urls-config-test.js')

  const results = await browserCatchConfig(configPath)
  t.is(results.length, 4)

  for (let urlResult of results) {
    t.is(urlResult.state, 'resolved')
    let result = urlResult.result
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  const snapshot = stripResult(results, serverSettings.port)
  t.snapshot(snapshot)
})

test('throwing if any of the urls fail', async t => {
  const serverSettings = await fixtureServer()
  const configPath = await writeTempJSFile({
    urls: [
      `${serverSettings.url}/error`,
      `http://somerandom/invalid`,
      `${serverSettings.url}/throw`,
      `http://yourkidding`,
      `http://doesnotexist/wow`,
    ]
  }, 'urls-config-test.js')

  const error = await t.throws(browserCatchConfig(configPath))
  const snapshot = stripResult(error, serverSettings.port)
  t.snapshot(snapshot)
})

test('running a config in json with an array of urls', async t => {
  const serverSettings = await fixtureServer()
  const configPath = await writeTempJSONFile({
    urls: [
      `${serverSettings.url}/error`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`,
    ]
  }, 'urls-config-test.json')

  const results = await browserCatchConfig(configPath)
  t.is(results.length, 4)

  for (let urlResult of results) {
    t.is(urlResult.state, 'resolved')
    let result = urlResult.result
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  const snapshot = stripResult(results, serverSettings.port)
  t.snapshot(snapshot)
})
