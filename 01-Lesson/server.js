const http = require('http')

const host = '127.0.0.1'
const port = 7000

const notFound = (res) => {
  res.statusCode = 400
  res.setHeader('Content-type', 'text/plain')
  res.end('Not found')
}

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      switch (req.url) {
        case '/home':
          res.statusCode = 200
          res.setHeader('Content-type', 'text/plain')
          res.end('Home page')
          break
        case '/About':
          res.statusCode = 200
          res.setHeader('Content-type', 'text/plain')
          res.end('About page')
          break
        default:
          notFound(res)
          break
      }
      break

    case 'POST':
      switch (req.url) {
        case '/api/admin':
          res.statusCode = 200
          res.setHeader('Content-type', 'text/plain')
          res.end('Create admin request')
          break
        case '/api/user':
          res.statusCode = 200
          res.setHeader('Content-type', 'text/plain')
          res.end('Create user request')
          break
        default:
          notFound(res)
          break
      }
      break

    default:
      notFound(res)
      break
  }
})

server.listen(port, host, () => {
  console.log(`Server listening http://${host}:${port}`)
})
