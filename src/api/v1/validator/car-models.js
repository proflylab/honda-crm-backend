import { body } from 'express-validator'
import { utils } from '../../../helpers'

const { validateResult } = utils

const validator = {}

validator.create = [
  body('label').notEmpty().withMessage('label is required').trim(),
  validateResult
]

validator.update = [
  body('label').notEmpty().withMessage('label is required').trim(),
  validateResult
]

export default {
  validator
}
