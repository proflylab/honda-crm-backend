import { body } from 'express-validator'
import { utils } from '../../../helpers'

const { validateResult } = utils

const validator = {}

validator.create = [
  body('username').notEmpty().withMessage('username is required').trim(),
  body('password').notEmpty().withMessage('password is required').trim(),
  body('firstName').notEmpty().withMessage('firstName is required').trim(),
  body('lastName').notEmpty().withMessage('lastName is required').trim(),
  body('email').notEmpty().withMessage('email is required').trim(),
  body('phone').notEmpty().withMessage('phone is required').trim(),
  body('role').notEmpty().withMessage('role is required').trim(),
  // body('name').notEmpty().withMessage('name is required').trim(),
  // body('sha256')
  //   .isLength(64)
  //   .withMessage('sha256 must be 64 characters')
  //   .trim(),
  validateResult
]

validator.update = [
  body('username').notEmpty().withMessage('username is required').trim(),
  body('firstName').notEmpty().withMessage('firstName is required').trim(),
  body('lastName').notEmpty().withMessage('lastName is required').trim(),
  body('email').notEmpty().withMessage('email is required').trim(),
  body('phone').notEmpty().withMessage('phone is required').trim(),
  body('role').notEmpty().withMessage('role is required').trim(),
  validateResult
]

export default {
  validator
}
