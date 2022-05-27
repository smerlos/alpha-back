const { Router } = require('express')
const { validateRequest } = require('../../middlewares')

const router = Router()

router.get('/', validateRequest(__dirname), async (req, res) => {
  res.json(await req.models.Tasks.findAll())
})

router.get('/:id', validateRequest(__dirname), async (req, res) => {
  res.json(await req.models.Tasks.findByPk(req.params.id))
})

router.get('/cancel/:id', validateRequest(__dirname), async (req, res) => {
  res.json(await req.models.Tasks.findAll())
})

module.exports = router
