require('dotenv').config()
const { ConnectionString } = require('connection-string')

const {
  NODE_ENV = 'development',
  DB_CONNECTION_STRING = 'mysql://root:root@127.0.0.1:3306/granite'
} = process.env

const cnx = new ConnectionString(DB_CONNECTION_STRING)

const databaseOptions = {
  [`${NODE_ENV}`]: {
    username: cnx.user,
    password: cnx.password,
    database: cnx.path[0],
    port: cnx.port,
    host: cnx.hostname,
    dialect: cnx.protocol,
    logging: false
  }
}

module.exports = databaseOptions
