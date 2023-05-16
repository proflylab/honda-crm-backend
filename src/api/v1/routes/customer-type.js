import { Router } from 'express'
import { knex } from '../../../helpers'

const router = Router()

router.get('/', async (req, res) => {
  const result = await knex('customer_types').select()
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  const { id } = params
  const result = await knex('customer_types').first().where({ id })
  return res.json(result)
})

export default router
