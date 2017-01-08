const phantomjs = require('phantomjs-prebuilt')
const net = require('net')

const webdriverOptions = {
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
}

export default async function (options) {
  let port = await getPort()

  options = Object.assign({}, {port}, options)

  let driver = await createDriver(options)
  let host = 'localhost'

  return Object.assign({},
    driver,
    {
      driverType: 'phantomjs',
      url: `http://${host}:${port}`,
      webdriverOptions: Object.assign({},
        {port},
        webdriverOptions
      )
    })
}

function createDriver (options) {
  return phantomjs
    .run(`--webdriver=${options.port}`)
    .then(onDriver)
}

function onDriver (driverProcess) {
  return {
    kill: () => driverProcess.kill()
  }
}

async function getPort () {
  return new Promise((resolve, reject) => {
    let server = net.createServer()
    server.unref()
    server.on('error', reject)

    // zero gives it away ;)
    server.listen(0, () => {
      let port = server.address().port

      server.close(() => {
        resolve(port)
      })
    })
  })
}
