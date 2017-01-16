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
]

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
    let port = server.address().port

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

    function onLogHost (port, error, address) {
      if (error) throw error
      let url = `http://${address}:${port}`
      if (options.verbose) console.log(`Example app listening at ${url}`)

      resolve(Object.assign({},
        { address },
        { url },
        { app },
        { add: addRoute.bind(null, app, options) }
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
  let query = request.query
  let head = resolveContentSegment('head', route, {query})
  let body = resolveContentSegment('body', route, {query})
  let htmlContent = resolveContentSegment('html', route,
      Object.assign({}, {head, body, query})
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
