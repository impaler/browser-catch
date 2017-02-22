import test from 'ava'
const path = require('path')
const fixtureServer = require('../fixtures/server/server').default
const browserCatchUrl = require('../../src').browserCatchUrl
const { stripResult } = require('./../helpers/result')
const DRIVER_TYPE = 'phantomjs'

test('catching 1 error from a url', async t => {
  let serverSettings = await fixtureServer()
  let result = await browserCatchUrl(`${serverSettings.url}/error`)
  let snapshot = stripResult(result, serverSettings.port)

  t.is(result.driverType, DRIVER_TYPE)
  t.is(result.errors.length, 1)
  t.snapshot(snapshot)
})

test('catching 10 errors from a url', async t => {
  let serverSettings = await fixtureServer()
  let result = await browserCatchUrl(`${serverSettings.url}/error?count=10`)
  let snapshot = stripResult(result, serverSettings.port)

  t.is(result.driverType, DRIVER_TYPE)
  t.is(result.errors.length, 10)
  t.snapshot(snapshot)
})

test('catching no errors from a valid url', async t => {
  const serverSettings = await fixtureServer()
  const result = await browserCatchUrl(`${serverSettings.url}`)
  const snapshot = stripResult(result, serverSettings.port)

  t.is(result.driverType, DRIVER_TYPE)
  t.is(result.errors.length, 0)
  t.snapshot(snapshot)
})

test('waitForExist option waits for an element to exist ', async t => {
  const serverSettings = await fixtureServer()
  const options = {
    waitForExist: '.appended-after-5000'
  }
  const start = new Date()
  const result = await browserCatchUrl(`${serverSettings.url}/append-element-after`, options)
  const duration = new Date() - start

  t.true(duration > 5000)
  t.is(result.driverType, DRIVER_TYPE)
  t.is(result.errors.length, 2)

  const snapshot = stripResult(result, serverSettings.port)
  t.snapshot(snapshot)
})

test('run option on a custom async script', async t => {
  const serverSettings = await fixtureServer()
  const runScriptPath = path.resolve(__dirname, '../fixtures/custom-run.js')
  const options = {
    run: runScriptPath
  }
  const result = await browserCatchUrl(`${serverSettings.url}/dogs`, options)

  t.is(result.driverType, DRIVER_TYPE)
  t.is(result.errors.length, 0)

  const snapshot = stripResult(result, serverSettings.port)
  t.snapshot(snapshot)
})
