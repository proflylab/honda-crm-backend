import { Router } from 'express'
import car from './car'
import customer from './customer'
import customerType from './customer-type'
import user from './user'

const routes = Router()

routes.use('/car', car)
routes.use('/customer', customer)
routes.use('/customer-type', customerType)
routes.use('/user', user)

export default routes
