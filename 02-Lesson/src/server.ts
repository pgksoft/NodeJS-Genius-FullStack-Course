import express from 'express'
import bodyParser from 'body-parser'
import APP_TITLE from './domain/app-infrastructure/const/app-title'
import taskStore from './domain/tasks/task-store/task-store'
import apiUrl from './domain/app-infrastructure/api/const/api-url'
import createTask from './domain/tasks/model/create-task'
import removeTask from './domain/tasks/model/remove-task'
import updateTask from './domain/tasks/model/update-task'
import sendMutationResult from './domain/app-infrastructure/app-helpers/entity-mutation-result-response/send-mutation-result'

const app = express()
const port = 5000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  return res.send(`${APP_TITLE.hi}, ${APP_TITLE.name}!`)
})

const url = apiUrl.task

app.get(url, (req, res) => {
  return res.status(200).json(taskStore.tasks)
})

app.post(url, (req, res) => {
  const result = createTask(req.body)
  sendMutationResult(result, res)
})

app.put(`${url}:id`, (req, res) => {
  const result = updateTask({ id: parseInt(req.params.id), body: req.body })
  sendMutationResult(result, res)
})

app.delete(`${url}:id`, (req, res) => {
  const result = removeTask(parseInt(req.params.id))
  sendMutationResult(result, res)
})

app.listen(port, () => {
  console.log(`${APP_TITLE.launchServer} ${APP_TITLE.localUrl}:${port}`)
})
