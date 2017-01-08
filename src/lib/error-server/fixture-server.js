import http from 'http'
import notFoundContent from './not-found-page'

const ERRORS = [
  {
    name: 'error',
    body: message => {
      message = message || `"A regular console.error"`
      return `console.error(${message})`
    }
  },
  {
    name: 'all-console-logs',
    body: () => `
      console.log("normal log");
      console.info("normal info");
      console.warn("normal warn");
      console.error("normal error");`
  },
  {
    name: 'throw',
    body: message => {
      message = message || 'A throw in js'
      return `throw new Error("${message}");`
    }
  },
  {
    name: 'timeout',
    body: duration => {
      duration = duration || 2000
      return `setTimeout(function () {
        throw new Error("Timeout error thrown after ${duration}");
       }, ${duration});`
    }
  }
]

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

  const matchingErrors = ERRORS.filter(error => {
    let exactMatch = new RegExp('\\b' + error.name + '\\b', 'g')
    return !!request.url.match(exactMatch)
  })

  if (matchingErrors.length > 0) {
    errorsResponse(matchingErrors, response)
  } else if (request.url === '/') {
    indexPageResponse(response)
  } else {
    notFoundResponse(response)
  }
}

function errorsResponse (errors, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })

  const errorCodeContent = errors.map(error => error.body())

  response.write(`<html>
    <head>
<link rel="icon" href="favicon.ico">
</head>
    <body>
        <script>
            ${errorCodeContent.join('\n')}
        </script>
        <ul>
        ${errors.map(error => `<li>${error.name}</li>`).join('\n')}
        </ul>
    </body>
</html>`)
  response.end()
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
