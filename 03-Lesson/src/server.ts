import { app } from './app-infrastructure/app'
import { port } from './app-infrastructure/const/app-const'
import APP_TITLE from './app-infrastructure/const/app-title'

app.listen(port, () => {
  console.log(`🚀 ${APP_TITLE.launchServer} ${APP_TITLE.localUrl}:${port}`)
})
