require('dotenv').config()

const { pick } = require('lodash')

module.exports = {
  SERVER_PORT: 8080,
  SERVER_HOST: 'localhost',
  ...pick(process.env, ['SERVER_PORT', 'SERVER_HOST'])
}
