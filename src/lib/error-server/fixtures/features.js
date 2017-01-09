const FIXTURES = [
  {
    name: 'append-element-after',
    body: (className, duration) => {
      duration = duration || 5000
      className = className || `appended-after-${duration}`
      return `
  <script type="text/javascript">
  console.log('append')
    setTimeout(function() {
      var paragraphElement = document.createElement("p");
      paragraphElement.className = "${className}";
      paragraphElement.innerText = "Boo!!! I have appeared after ${duration}ms";
      document.body.appendChild(paragraphElement); 
    }, ${duration})
  </script>
`
    }
  },
  {

    name: 'wait-for-thrws',
    body: (className, duration) => {
      duration = duration || 2000
      className = className || `appended-after-${duration}`
      return `
  <script type="text/javascript">
  console.log('append')
    setTimeout(function() {
      var paragraphElement = document.createElement("p");
      paragraphElement.className = "${className}";
      paragraphElement.innerText = "Boo!!! I have appeared after ${duration}ms";
      document.body.appendChild(paragraphElement);
      setTimeout(function() { throw 'wow' }, 500)
    }, ${duration})
  </script>
`
    }
  },
]

export default  FIXTURES