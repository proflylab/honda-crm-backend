import knex from 'knex'

const {
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_CONNECTION_TIMEOUT
} = process.env

export default knex({
  client: DB_CLIENT,
  connection: {
    host: DB_HOST,
    port: parseInt(DB_PORT) || 1433,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    connectionTimeout: parseInt(DB_CONNECTION_TIMEOUT) || 30000
  }
})
