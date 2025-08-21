import { Express } from 'express'
import APP_TITLE from '../const/app-title'
import apiUrl from '../api/const/api-url'
import taskRouter from '../../domain/tasks/routes'

export const applyRoutes = (app: Express) => {
  app.get(apiUrl.server, (req, res) => {
    res.send(`${APP_TITLE.hi}, ${APP_TITLE.name}!`)
  })

  app.use(apiUrl.task, taskRouter)
}
