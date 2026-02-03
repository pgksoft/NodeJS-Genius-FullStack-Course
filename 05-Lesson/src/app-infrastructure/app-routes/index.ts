import type { Express } from 'express';
import express from 'express';
import APP_TITLE from '../const/app-title';
import apiAuthUrl, { apiUnAuthUrl } from '../api/const/api-url';
import taskRouter from '../../domain/tasks/routes';
import userRegisterRouter from '../../domain/users/routes/user-register';
import userLoginRouter from '../../domain/users/routes/user-login';
import imageRouter from '../../domain/multer-examples/routes';
import mediaRouter from '../../domain/media-library/routes';
import userRouter from '@domain/users/routes';
import taskStatusDicRouter from '@domain/tasks/inner-entities/task-status-dic/routes';
import taskStatusLogRouter from '@domain/tasks/inner-entities/task-status-log/routes';
import { config } from '../../../settings-core/env';
import { requireAuth } from '@middleware/require-auth';

export const applyRoutes = (app: Express) => {
  // Unauthorized URLs

  app.get(apiUnAuthUrl.server, (req, res) => {
    res.send(`${APP_TITLE.hi}, ${APP_TITLE.name}!`);
  });

  app.use(apiUnAuthUrl.userRegister, userRegisterRouter);

  app.use(apiUnAuthUrl.userLogin, userLoginRouter);

  // Authorized URLs

  app.use(requireAuth);

  app.use(apiAuthUrl.user, userRouter);

  app.use(apiAuthUrl.uploads, express.static(config.multerDestination));

  app.use(apiAuthUrl.task, taskRouter);

  app.use(apiAuthUrl.taskStatusDic, taskStatusDicRouter);

  app.use(apiAuthUrl.taskStatusLog, taskStatusLogRouter);

  app.use(apiAuthUrl.image, imageRouter);

  app.use(apiAuthUrl.mediaLibrary, mediaRouter);
};
