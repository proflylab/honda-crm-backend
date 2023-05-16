import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.printf(
          (info) => `${info.timestamp} [${info.level}] ${info.message}`
        )
      )
    })
  ]
})

export default logger
