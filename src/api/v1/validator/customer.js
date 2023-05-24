import { body } from 'express-validator'
import { utils } from '../../../helpers'

const { validateResult } = utils

const validator = {}

validator.create = [
  body('name').notEmpty().withMessage('name is required').trim(),
  body('type').notEmpty().withMessage('firstName is required').trim(),
  body('mobilePhone').notEmpty().withMessage('lastName is required').trim(),
  validateResult
]

validator.update = [
  body('name').notEmpty().withMessage('name is required').trim(),
  body('type').notEmpty().withMessage('firstName is required').trim(),
  body('mobilePhone').notEmpty().withMessage('lastName is required').trim(),
  validateResult
]

export default {
  validator
}
