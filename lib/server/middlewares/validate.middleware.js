/* eslint-disable security/detect-non-literal-fs-filename */

const fs = require('fs')
const path = require('path')
const { default: AJV } = require('ajv')
const YAML = require('yaml')
const { pick } = require('lodash')
const { StatusCodes } = require('http-status-codes')

const getMethod = (methods) =>
  Object.entries(methods).reduce((state, [k, v]) => {
    if (state) {
      return state
    }
    if (v) {
      state = k
    }
    return state
  }, null)

const getFilename = async (type, { req, dirname }) => {
  const { path: routePath, methods } = req.route
  const method = getMethod(methods)

  const normalizedPath = routePath.replace(/\//g, ' ').replace(/:/, '')
  const filename = [type, method, ...normalizedPath.split(' ')]
    .filter((item) => item?.length)
    .join('-')

  const schemaFilename = path.resolve(dirname, `${filename}.schema`)
  if (fs.existsSync(`${schemaFilename}.json`)) {
    // eslint-disable-next-line security/detect-non-literal-require
    return require(`${schemaFilename}.json`)
  }

  if (fs.existsSync(`${schemaFilename}.yaml`)) {
    const content = await fs.promises.readFile(`${schemaFilename}.yaml`, 'utf8')
    return YAML.parse(content)
  }

  return undefined
}

module.exports.validateRequest = (dirname) => {
  const ajv = new AJV({
    coerceTypes: true
  })
  return async (req, res, next) => {
    const inputSchema = await getFilename('in', { req, dirname })
    if (inputSchema) {
      const inputValidateFunction = ajv.compile(inputSchema)
      if (
        !inputValidateFunction(
          pick(req, ['body', 'query', 'params', 'headers'])
        )
      ) {
        res.statusCode = StatusCodes.BAD_REQUEST
        return next(inputValidateFunction.errors[0])
      }
    }

    const outputSchema = await getFilename('out', { req, dirname })
    if (outputSchema) {
      const outputValidateFunction = ajv.compile(outputSchema)
      res.json = ((_super) => {
        return function (data) {
          if (
            res.statusCode < StatusCodes.MULTIPLE_CHOICES &&
            !outputValidateFunction(data)
          ) {
            res.statusCode = StatusCodes.NOT_IMPLEMENTED
            return next(outputValidateFunction.errors[0])
          }
          return _super.call(this, data)
        }
      })(res.json)
    }
    next()
  }
}
