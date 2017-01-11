import test from 'ava'

require('babel-polyfill')
require('babel-register')

const server = require('./../../src/lib/error-server/fixture-server')
const fork = require('./../../src/lib/fork')
const {stripDefaultReporterHack} = require('./../helpers/result')

test.beforeEach(async t => {
  t.context.server = await server()
})

test.afterEach(async t => {
  await t.context.server.kill()
})

test('ChromeDriver catch 1 error', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`, '--driver', 'chrome'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('ChromeDriver catch 1 error to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`, '--driver', 'chrome', '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('ChromeDriver catch 0 errors', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/`, '--driver', 'chrome'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('ChromeDriver catch 0 errors to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`, '--driver', 'chrome', '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

// test('ChromeDriver throws error when testing a url with a 404', async t => {
//   const port = t.context.server.port
//   const errors = await fork([`localhost:${port}/404`, '--driver', 'chrome'])
//   const errorsParsed = stripDefaultReporterHack(errors.stdout, port)
//
//   t.is(errorsParsed.driverType, 'chrome')
//   t.is(errorsParsed.errors.length, 1)
//   t.snapshot(errorsParsed)
// })

// Requires a custom selenium server url & port running
// Makes testing the rest in prallel difficult when the selenium/standalone-chrome
// fails with xvfb-run: error: Xvfb failed to start when more than one is running
// So it needs to be a separate test run

test('webdriver-custom-url ChromeDriver catches 0 errors and works with custom selenium url', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`, '--driver', 'chrome', '--webdriver-port', 3445, '--webdriver-host', 'localhost'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})
