import './helpers'

import { passport, utils } from './helpers'

import api from './api'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import listEndpoints from 'express-list-endpoints'
import requestIp from 'request-ip'

const app = express()
const http = require('http').createServer(app)

const { isAuthenticated } = passport
const { handleError, handleNotFound } = utils

app.use(cors())
app.use(compression())
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(isAuthenticated)

app.get('/', async (req, res) => {
  const ip = requestIp.getClientIp(req)
  return res.json({ ip })
})

app.use('/api', api)

app.use(handleError)
app.use(handleNotFound)

listEndpoints(app).map(({ path, methods }) =>
  methods.map((m) => console.log(`${m.padEnd(10)}${path}`))
)

listEndpoints(api).map(({ path, methods }) =>
  methods.map((m) => console.log(`${m.padEnd(10)}api${path}`))
)

const ip = process.env.IP || '::'
const port = process.env.PORT || 3000
http.listen(port, '::', () => console.log(`Listening on ${ip}:${port}`))
