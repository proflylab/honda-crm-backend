import { Router } from 'express'
import createError from 'http-errors'
import { customer } from '../validator'
import { knex } from '../../../helpers'

const router = Router()

router.get('/', async (req, res) => {
  const result = await knex('customers').select().where({ deletedAt: null })
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  const { id } = params
  const result = await knex('customers').first().where({ id, deletedAt: null })
  return res.json(result)
})

router.post('/', customer.validator.create, async (req, res) => {
  const { body } = req
  if (body.cars && body.cars.length > 0) {
    try {
      await knex.transaction(async (trx) => {
        const cars = body.cars
        delete body.cars
        body.createdAt = new Date()
        body.updatedAt = new Date()
        const customer = await trx('customers').insert(body).returning('id')
        await trx('cars').insert(
          cars.map((car) => ({ ...car, customerId: customer[0].id }))
        )
      })
      return res.status(201).send()
    } catch (error) {
      throw createError(500, error.message)
    }
  } else {
    delete body.cars
    body.createdAt = new Date()
    body.updatedAt = new Date()
    await knex('customers').insert(body).returning('id')
    return res.status(201).send()
  }
})

router.put('/:id', customer.validator.update, async (req, res) => {
  const { body, params } = req
  const { id } = params
  if (body.cars && body.cars.length > 0) {
    try {
      await knex.transaction(async (trx) => {
        const cars = body.cars
        delete body.id
        delete body.cars
        delete body.createdAt
        body.updatedAt = new Date()
        await trx('customers').update(body).where({ id, deletedAt: null })
        await trx('cars')
          .update({ deletedAt: new Date() })
          .where({ customerId: id, deletedAt: null })
        await trx('cars').insert(
          cars.map((car) => {
            delete car.id
            delete car.createdAt
            car.updatedAt = new Date()
            return { ...car, customerId: id }
          })
        )
      })
      return res.status(204).send()
    } catch (error) {
      throw createError(500, error.message)
    }
  } else {
    delete body.cars
    delete body.createdAt
    body.updatedAt = new Date()
    await knex('customers').update(body).where({ id })
    await knex('cars')
      .where({ customerId: id, deletedAt: null })
      .update({ deletedAt: new Date() })
    return res.status(204).send()
  }
})

router.patch('/', async (req, res) => {
  const { body } = req
  try {
    await knex.transaction(async (trx) => {
      await trx('customers')
        .whereIn('id', body.ids)
        .update({ deletedAt: new Date() })
      await trx('cars')
        .update({ deletedAt: new Date() })
        .whereIn('customerId', body.ids)
    })
    return res.status(204).send()
  } catch (error) {
    throw createError(500, error.message)
  }
})

export default router
