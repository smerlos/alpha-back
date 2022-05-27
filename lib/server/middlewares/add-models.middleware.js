module.exports.addModelsMiddleware = () => {
  return (req, _, next) => {
    req.models = require('../../database/models')
    next()
  }
}
