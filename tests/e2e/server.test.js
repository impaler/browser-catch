import test from 'ava'

require('isomorphic-fetch')
require('babel-polyfill')

let fixtureServer = require('../../dist/lib/server/server')

test('the server will respond with a 404 for unknown content', async t => {
  let serverSettings = await fixtureServer()
  let response = await fetch(`${serverSettings.url}/randomstuff`)

  t.is(response.status, 404)
  t.is(response.statusText, 'Not Found')
})

test('server pass query arguments, body and head through to htmlTemplate', async t => {
  let ROUTE_TEMPLATE_FIXTURE = {
    name: '/',
    head: `<link type="text/css" href="some-styles.css" />`,
    body: `<h2>Override body</h2>`,
    htmlTemplate: context => `
<html>
  <head>
    ${context.head}
  </head>
  <body>
    <h1>${JSON.stringify(context.query)}</h1>
    ${context.body}
  </body>
</html>`
  }

  let serverSettings = await fixtureServer({routes: [ROUTE_TEMPLATE_FIXTURE]})
  let response = await fetch(`${serverSettings.url}/?apples=green&banana=yellow&square=4&triangle=3`)
  let responseText = await response.text()

  t.snapshot(responseText)
})
