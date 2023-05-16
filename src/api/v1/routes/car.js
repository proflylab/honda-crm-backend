import { Router } from 'express'
import { knex } from '../../../helpers'

const router = Router()

router.get('/', async (req, res) => {
  const { query } = req
  const { customerId } = query
  const result = await knex('cars')
    .select()
    .where({ customerId, deletedAt: null })
    .limit(6)
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  const { id } = params
  const result = await knex('cars').first().where({ id })
  return res.json(result)
})

export default router
