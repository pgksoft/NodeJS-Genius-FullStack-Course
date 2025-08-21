import bodyParser from 'body-parser'
import { Express } from 'express'

export const applyMiddleware = (app: Express) => {
  app.use(bodyParser.json())
  // you can add loggers, CORS, cookie-parser, etc.
}
