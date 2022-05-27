const http = require('http')

const { requestListener } = require('./request-listener')
const config = require('../config/server')

const server = http.createServer(requestListener)

server.listen(Number(config.SERVER_PORT), config.SERVER_PORT, () => {
  console.log('Listen at', config.SERVER_PORT)
})
