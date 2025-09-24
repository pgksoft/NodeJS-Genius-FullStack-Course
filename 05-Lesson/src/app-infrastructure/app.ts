import express, { Express } from 'express'
import { applyMiddleware } from './middleware'
import { applyRoutes } from './routes'

export const createApp = (): Express => {
  const app = express()
  applyMiddleware(app)
  applyRoutes(app)
  return app
}
