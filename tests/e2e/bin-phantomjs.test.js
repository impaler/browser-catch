const path = require('path')
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

test('phantomjs catch 1 errors', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 1 errors to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`, '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`, '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitFor', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/append-element-after`, '-f', '.appended-after-5000'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitForExist with a throw just after', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/wait-for-thrws`, '-f', '.appended-after-2000', '-p', 2000])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs option run a custom async script with webdriver calls', async t => {
  const port = t.context.server.port
  const scriptPath = path.resolve(__dirname, '../fixtures/custom-run.js')
  const errors = await fork([`localhost:${port}/dogs`, '--run', scriptPath, '-j'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

// test('phantomjs option run a custom async script that throws', async t => {
//
// })
