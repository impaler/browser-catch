const os = require('os')
const dns = require('dns')
const http = require('http')
const express = require('express')

const DEFAULT_HEADER = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
}

const DEFAULT_ROUTES = [
  {
    name: '/favicon.ico',
    html: '',
    header: {'Content-Type': 'image/x-icon'}
  },
  {
    name: '/',
  },
]

let DEFAULT_ROUTE = {
  headTemplate: context => `<title>${context.name}</title>`,
  htmlTemplate: context => `<html>
  <head>
    ${context.head}
  </head>
  <body>
    ${context.body}
  </body>
</html>`
}

const scriptTemplate = context => `<script>
    ${context.script}
  </script>`

const DEFAULT_OPTIONS = {
  verbose: false,
  routes: []
}

export default function (options) {
  options = Object.assign(DEFAULT_OPTIONS, options) || DEFAULT_OPTIONS
  return new Promise(resolveServer)

  function resolveServer (resolve, reject) {
    let app = express()
    let server = http.createServer(app).listen()
    let port = options.port || server.address().port

    server.close()
      .on('close', () => {
        if (options.verbose) console.log('Server stopped')
        app.listen(port, function () {
          dns.lookup(os.hostname(), onLogHost.bind(this, port))
        })
      })
      .on('error', error => reject(error))

    let routes = [...DEFAULT_ROUTES, ...options.routes]
    for (let route of routes) {
      addRoute(route, app, options)
    }

    DEFAULT_ROUTES[1].body = `<ul>
    ${listRoutes(app)}
</ul>`

    function listRoutes (app) {
      return app._router.stack
        .filter(item => item.name === 'bound dispatch')
        .map(item => `<li><a href="${item.route.path}">${item.route.path}</a></li>`).join('\n')
    }

    function onLogHost (port, error, address) {
      if (error) throw error
      let url = `http://${address}:${port}`
      if (options.verbose) console.log(`Example app listening at ${url}`)

      resolve(Object.assign({},
        {url, address, port, app},
        {add: addRoute.bind(null, app, options)}
      ))
    }
  }
}

function addRoute (route, app, options) {
  if (route.name) {
    app.get(route.name, resolveRoute.bind(null, route, options))
  } else {
    throw new Error('add requires a routePath and content parameter to add a route')
  }
}

function resolveRoute (route, options, request, response) {
  let context = {name: route.name, query: request.query}
  route = Object.assign({}, DEFAULT_ROUTE, route)

  let head = resolveContentSegment('head', route, context)
  let body = resolveContentSegment('body', route, context)
  let htmlContent = resolveContentSegment('html', route,
      Object.assign({}, context, {head, body})
    ) || ''
  let header = Object.assign({}, DEFAULT_HEADER, route.header)

  response.set(header)
  response.send(htmlContent)
}

function resolveContentSegment (key, route, context) {
  let template = route[`${key}Template`]
  if (template) {
    return template(context)
  } else {
    return route[key]
  }
}
