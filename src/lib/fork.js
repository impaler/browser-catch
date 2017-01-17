const path = require('path')
const execFile = require('child_process').execFile
const util = require('util');

const binPath = path.resolve(`${__dirname}/../../bin/browser-catch.js`)

export default async function (args) {
  return new Promise(onExec)

  function onExec (resolve, reject) {
    if (util.isString(args)) {
      args = args.split(' ')
    }

    args = [binPath, ...args]

    execFile('node', args, (error, stdout, stderr) => {
      if (error || !stdout || stdout === '') {
        reject({error, stdout, stderr})
      }
      resolve({error, stdout, stderr})
    })
  }
}
