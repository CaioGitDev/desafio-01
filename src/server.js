import http from 'node:http'
import { routes } from './routes/routes.js'
import { json } from './middlewares/json.js'
import { extractQueryParam } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {

    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.query = query ? extractQueryParam(query) : {}
    req.params = params

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3333)