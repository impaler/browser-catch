const path = require('path')
const execFile = require('child_process').execFile

const binPath = path.resolve(`${__dirname}/../../bin/browser-catch.js`)

export default async function (args) {
  return new Promise(onExec)

  function onExec (resolve, reject) {
    args = [binPath, ...args]

    execFile('node', args, (error, stdout, stderr) => {
      if (!stdout || stdout === '') {
        reject({error, stdout, stderr})
      }
      resolve({error, stdout, stderr})
    })
  }
}
