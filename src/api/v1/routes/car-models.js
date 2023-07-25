import { knex, passport } from '../../../helpers'

import { Router } from 'express'
import { carModels } from '../validator'
import createError from 'http-errors'

const { isAdmin } = passport
const router = Router()

router.get('/', async (req, res) => {
  const result = await knex('car_models').select().where({ deletedAt: null })
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  const { id } = params
  const result = await knex('car_models').first().where({ id, deletedAt: null })
  return res.json(result)
})

router.post('/', isAdmin, carModels.validator.create, async (req, res) => {
  const { body } = req
  const result = await knex('car_models').where({ label: body.label }).first()
  if (result) throw createError(409, 'Model already exists.')
  body.createdAt = new Date()
  body.updatedAt = new Date()
  await knex('car_models').insert(body)
  return res.status(201).send()
})

router.put('/:id', isAdmin, carModels.validator.update, async (req, res) => {
  const { body, params } = req
  const result = await knex('car_models').where({ id: params.id }).first()
  if (!result) throw createError(404, 'Model not found.')
  if (body.label !== result.label) {
    const result = await knex('car_models')
      .where({ label: body.label, deletedAt: null })
      .first()
    if (result) throw createError(409, 'Model already exists.')
  }

  delete body.createdAt
  body.updatedAt = new Date()
  await knex('car_models')
    .where({ id: params.id, deletedAt: null })
    .update(body)
  return res.status(204).send()
})

router.patch('/', isAdmin, async (req, res) => {
  const { body } = req
  await knex('car_models')
    .whereIn('id', body.ids)
    .update({ deletedAt: new Date() })
  return res.status(204).send()
})

export default router
