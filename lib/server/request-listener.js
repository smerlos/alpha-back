/* eslint-disable security/detect-non-literal-fs-filename */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const fs = require('fs')
const path = require('path')
const unixify = require('unixify')

const { errorMiddleware, notFoundMiddleware, addModelsMiddleware } = require('./middlewares')

const ROUTES_DIRECTORY = path.resolve(__dirname, 'routes')

const requestListener = express()
requestListener.use(cors())
requestListener.use(helmet())
requestListener.use(express.json())
requestListener.use(addModelsMiddleware())

//
//  Build Routes
//
const filenames = fs.readdirSync(ROUTES_DIRECTORY)
filenames.forEach(filename => {
  const routePath = path.resolve(ROUTES_DIRECTORY, filename)
  if (fs.statSync(routePath).isDirectory()) {
    const basePath = unixify(`/${filename}`, true)
    // eslint-disable-next-line security/detect-non-literal-require
    requestListener.use(basePath, require(routePath))
  }
})

requestListener.use(notFoundMiddleware())
requestListener.use(errorMiddleware())

module.exports.requestListener = requestListener
