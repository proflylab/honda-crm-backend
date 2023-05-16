import { knex, passport } from '../../../helpers'

import { Router } from 'express'
import bcrypt from 'bcrypt'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import { user } from '../validator'

const { isAdmin } = passport
const router = Router()

router.get('/', isAdmin, async (req, res) => {
  const result = await knex('users')
    .select(
      'id',
      'username',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'createdAt',
      'updatedAt'
    )
    .where({ deletedAt: null })
  return res.json(result)
})

router.get('/me', async (req, res) => {
  const {
    user: { id }
  } = req
  const user = await knex('users').where({ id, deletedAt: null }).first()
  if (!user) throw createError(404, 'User not found.')
  delete user.password
  return res.json(user)
})

router.get('/generate', async (req, res) => {
  const {
    query: { plain = 'P@ssw0rd' }
  } = req
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(plain, salt)
  return res.json({ plain, hash })
})

router.get('/:id', isAdmin, async (req, res) => {
  const { params } = req
  const { id } = params
  const result = await knex('users')
    .first(
      'id',
      'username',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'createdAt',
      'updatedAt'
    )
    .where({ id, deletedAt: null })
  return res.json(result)
})

router.post('/', isAdmin, user.validator.create, async (req, res) => {
  const { body } = req
  const user = await knex('users').where({ username: body.username }).first()
  if (user) throw createError(409, 'Username already exists.')
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)
  body.password = hash
  body.createdAt = new Date()
  body.updatedAt = new Date()
  await knex('users').insert(body)
  return res.status(201).send()
})

router.put('/:id', isAdmin, user.validator.update, async (req, res) => {
  const { body, params } = req
  const user = await knex('users').where({ id: params.id }).first()
  if (!user) throw createError(404, 'User not found.')
  if (body.username !== user.username) {
    const user = await knex('users')
      .where({ username: body.username, deletedAt: null })
      .first()
    if (user) throw createError(409, 'Username already exists.')
  }
  if (body.password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)
    body.password = hash
  } else {
    delete body.password
  }
  delete body.createdAt
  body.updatedAt = new Date()
  await knex('users').where({ id: params.id, deletedAt: null }).update(body)
  return res.status(204).send()
})

router.patch('/', isAdmin, async (req, res) => {
  const { body } = req
  await knex('users').whereIn('id', body.ids).update({ deletedAt: new Date() })
  return res.status(204).send()
})

router.post('/login', async (req, res) => {
  const { body } = req
  const user = await knex('users')
    .where({ username: body.username, deletedAt: null })
    .first()
  if (!user) throw createError(401, 'Username or password is incorrect.')
  const match = await bcrypt.compare(body.password, user.password)
  if (!match) throw createError(401, 'Username or password is incorrect.')
  delete user.password
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
  return res.json({ token })
})

export default router
