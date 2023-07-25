import { Router } from 'express'
import car from './car'
import carModels from './car-models'
import customer from './customer'
import customerType from './customer-type'
import user from './user'

const routes = Router()

routes.use('/car', car)
routes.use('/car-models', carModels)
routes.use('/customer', customer)
routes.use('/customer-type', customerType)
routes.use('/user', user)

export default routes
