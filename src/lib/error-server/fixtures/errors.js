const FIXTURES = [
  {
    name: 'error',
    script: message => {
      message = message || `"A regular console.error"`
      return `console.error(${message})`
    }
  },
  {
    name: 'all-console-logs',
    script: () => `
      console.log("normal log");
      console.info("normal info");
      console.warn("normal warn");
      console.error("normal error");`
  },
  {
    name: 'throw',
    script: message => {
      message = message || 'A throw in js'
      return `throw new Error("${message}");`
    }
  },
  {
    name: 'timeout',
    script: duration => {
      duration = duration || 2000
      return `setTimeout(function () {
        throw new Error("Timeout error thrown after ${duration}");
       }, ${duration});`
    }
  }
]

export default  FIXTURES
