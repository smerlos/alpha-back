const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const thisFileBasename = path.basename(__filename)

const { NODE_ENV = 'development' } = process.env

const config = require('../../config/database')[`${NODE_ENV}`]

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

const models = {
  sequelize,
  Sequelize
}

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== thisFileBasename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    // eslint-disable-next-line security/detect-non-literal-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    models[model.name] = model
  })

Object.keys(models).forEach((modelName) => {
  if (models[`${modelName}`].associate) {
    models[`${modelName}`].associate(models)
  }
})

module.exports = models
