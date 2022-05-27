const { StatusCodes } = require('http-status-codes')

module.exports.notFoundMiddleware = (options) => {
  const opts = {
    messageText: 'NOT-FOUND',
    ...options
  }
  return (_req, res, next) => {
    res.statusCode = StatusCodes.NOT_FOUND
    next(new Error(opts.messageText))
  }
}
