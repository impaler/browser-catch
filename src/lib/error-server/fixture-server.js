import http from 'http'
import { default as notFoundContent } from './not-found-page'
import { fixtureResponse, resolveFixtures } from './fixtures'

export default function (port = 0, logging = false) {
  return new Promise(onStart.bind(this))

  function onStart (resolve, reject) {
    let server = http.createServer(fixtureServer.bind(null, logging))

    let stop = () => {
      server
        .close()
        .on('close', () => {
          if (logging) console.log('Server stopped')
        })
        .on('error', error => { throw new Error(error) })
    }

    server
      .listen(port)
      .on('listening', () => {
        if (logging) console.log(`http://localhost:${port}`)
        resolve({
          port: server.address().port,
          kill: stop
        })
      })
      .on('error', error => reject(error))
  }
}

function fixtureServer (logging, request, response) {
  if (logging) console.log(`request ${request.url}`)

  if (request.url === '/favicon.ico') {
    response.writeHead(200, {
      'Content-Type': 'image/x-icon'
    })
    response.end()
    return
  }

  const matchingFixtures = resolveFixtures(request)

  if (matchingFixtures.length > 0) {
    fixtureResponse(matchingFixtures, response)
  } else if (request.url === '/') {
    indexPageResponse(response)
  } else {
    notFoundResponse(response)
  }
}

function indexPageResponse (response) {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
  response.write(`<html>
    <head>
<link rel="icon" href="favicon.ico">
</head>
    <body>
        <h1>Homepage</h1>
    </body>
</html>`)
  response.end()
}

function notFoundResponse (response) {
  response.writeHead(404, {
    'Content-Type': 'text/html'
  })
  response.write(notFoundContent)
  response.end()
}
