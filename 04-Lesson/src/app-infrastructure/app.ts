import express from 'express'
import { applyMiddleware } from './middleware'
import { applyRoutes } from './routes'

const app = express()

applyMiddleware(app)
applyRoutes(app)

export { app }
