const { StatusCodes } = require('http-status-codes')

module.exports.errorMiddleware = () => {
  return (error, _req, res, _next) => {
    if (res.statusCode < StatusCodes.MULTIPLE_CHOICES) {
      res.statusCode = StatusCodes.UNPROCESSABLE_ENTITY
    }
    console.info(error)
    res.json({
      error: error.message,
      status: res.status
    })
  }
}
