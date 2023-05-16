import createError from 'http-errors'
import logger from './logger'
import { validationResult } from 'express-validator'

export default {
  requestLogger: (req, _, next) => {
    logger.info(`[${req.method}] ${req.url}`)
    next()
  },
  handleError: (err, req, res, next) => {
    const { path } = req
    if (typeof err === 'object') {
      const status = err.status || 500
      res.status(status)
      if (res.headersSent) return next(err)
      if (err.response) {
        if (err.response.data) {
          const { data: message, status } = err.response
          logger.error(`${path} => ${JSON.stringify({ status, message })}`)
          return res.status(status).json({ status, message })
        }
        const { response: message, responseCode: status } = err
        logger.error(`${path} => ${JSON.stringify({ status, message })}`)
        return res.status(status).json({ status, message })
      } else if (err.message) {
        const { message } = err
        logger.error(`${path} => ${JSON.stringify({ status, message })}`)
        return res.json({ status, message })
      } else if (err.stack) {
        const { stack: message } = err
        logger.error(`${path} => ${JSON.stringify({ status, message })}`)
        return res.json({ status, message })
      } else {
        logger.error(`${path} => ${JSON.stringify({ status, err })}`)
        return res.status(500).json({ status: 500, err })
      }
    } else {
      logger.error(
        `${path} => ${JSON.stringify({
          status: 500,
          message: 'argument is not an object'
        })}`
      )
      return res
        .status(500)
        .json({ status: 500, message: 'argument is not an object' })
    }
  },
  handleNotFound: ({ res }) => {
    res.status(404).json({ status: 404, message: 'not found' })
  },
  validateResult: (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw createError(422, { message: errors.array() })
    next()
  }
}
