const path = require('path')
const execFile = require('child_process').execFile
const util = require('util')

const binPath = path.resolve(`${__dirname}/../../bin/browser-catch.js`)

export default async function (args) {
  return new Promise(onExec)

  function onExec (resolve, reject) {
    if (util.isString(args)) {
      args = args.split(' ')
    }

    args = [binPath, ...args]

    execFile('node', args, (error, stdout, stderr) => {
      if (error) {
        reject({error, stdout, stderr, code: error.code})
      } else {
        resolve({error, stdout, stderr, code: 0})
      }
    })
  }
}

// Debug me with a tool like webstorm nad the child process will step in with your breakpoints :)

const fork = require('child-process-promise').fork
const debug = typeof v8debug === 'object'

export async function forkBin (args, debugPort) {
  debugPort = debugPort || 40894
  let execArgv = debug ? ['--debug-brk', `--debug=${debugPort}`] : []
  args = args.split(' ')
  console.log(args)

  let forkPromise = fork(binPath, args, {
    execArgv
  })

  var childProcess = forkPromise.childProcess

  childProcess.on('close', () => {
    childProcess.kill()
  })

  childProcess.on('exit', () => {
    childProcess.kill()
  })

  childProcess.on('message', function (m) {
    console.log('PARENT got message:', m)
  })

  childProcess.on('data', function (m) {
    console.log('PARENT got data:', m)
  })

  let result = await forkPromise

  return result
}
