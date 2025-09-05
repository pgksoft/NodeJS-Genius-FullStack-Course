import express, { Express } from 'express'
import APP_TITLE from '../const/app-title'
import apiUrl from '../api/const/api-url'
import taskRouter from '../../domain/tasks/routes'
import userRegisterRouter from '../../domain/users/routes/user-register'
import userLoginRouter from '../../domain/users/routes/user-login'
import imageRouter from '../../domain/multer-examples/routes'
import mediaRouter from '../../domain/media-library/routes'
import { config } from '../app-config'

export const applyRoutes = (app: Express) => {
  app.get(apiUrl.server, (req, res) => {
    res.send(`${APP_TITLE.hi}, ${APP_TITLE.name}!`)
  })

  app.use(apiUrl.uploads, express.static(config.multerDestination))

  app.use(apiUrl.task, taskRouter)

  app.use(apiUrl.userRegister, userRegisterRouter)

  app.use(apiUrl.userLogin, userLoginRouter)

  app.use(apiUrl.image, imageRouter)

  app.use(apiUrl.mediaLibrary, mediaRouter)
}
