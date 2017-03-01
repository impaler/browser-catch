import test from 'ava'
const fetch = require('node-fetch')

import fixtureServer from '../src/lib/fixture-server'
import { HTML_TEMPLATE_FIXTURE } from './fixtures/server/server-tests'
import ERRORS from './fixtures/server/errors'
import FEATURES from './fixtures/server/features'

test('fixture-server to respond with a 404 for unknown content', async t => {
  const serverSettings = await fixtureServer()
  const response = await fetch(`${serverSettings.url}/randomstuff`)

  t.is(response.status, 404)
  t.is(response.statusText, 'Not Found')
})

test('passing query arguments to the context of the htmlTemplate', async t => {
  const ROUTES = {
    routes: [HTML_TEMPLATE_FIXTURE]
  }
  const serverSettings = await fixtureServer(ROUTES)
  const response = await fetch(`${serverSettings.url}/query?apples=green&banana=yellow&square=4&triangle=3`)
  const responseText = await response.text()

  t.snapshot(responseText)
})

test('passing multiple routes to the server', async t => {
  const ROUTES = {
    routes: [...ERRORS, ...FEATURES]
  }
  const serverSettings = await fixtureServer(ROUTES)

  const firstRouteResponse = await fetch(`${serverSettings.url}/cats`)
  const firstRoute = await firstRouteResponse.text()

  const secondRouteResponse = await fetch(`${serverSettings.url}/dogs`)
  const secondRoute = await secondRouteResponse.text()

  const thirdRouteResponse = await fetch(`${serverSettings.url}/error`)
  const thirdRoute = await thirdRouteResponse.text()

  const noRouteResponse = await fetch(`${serverSettings.url}/randomstuff`)
  const noRouteText = {status: noRouteResponse.status, statusText: noRouteResponse.statusText}

  t.snapshot({firstRoute, secondRoute, thirdRoute, noRouteText})
})
