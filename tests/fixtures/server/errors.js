const FIXTURES = [
  {
    name: '/error',
    bodyTemplate: context => {
      let query = context.query || {}
      let message = query.message || `A regular console.error`
      let count = query.count || 1
      let logError = `console.error("${message}")`
      let errors = Array.apply(null, Array(Number(count))).map(()=>logError)
      return `<script>${errors}</script>`
    }
  },
  {
    name: '/all-console-logs',
    body: `<script>
      console.log("console log log");
      console.info("console log info");
      console.warn("console log warn");
      console.error("console log error");
      </script>`
  },
  {
    name: '/throw',
    bodyTemplate: context => {
      let query = context.query || {}
      let message = query.message || `A throw in js`
      return `<script>throw new Error("${message}");</script>`
    }
  },
  {
    name: '/timeout',
    bodyTemplate: context => {
      let query = context.query || {}
      let delay = query.delay || 2000
      return `<script>setTimeout(function () {
        throw new Error("Timeout error thrown after ${delay}");
       }, ${delay});</script>`
    }
  }
]

export default  FIXTURES
