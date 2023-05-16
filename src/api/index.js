// import { db } from '../helpers'
import express from 'express'
import { routes as v1 } from './v1'
const api = express()

api.use('/v1', v1)

export default api
