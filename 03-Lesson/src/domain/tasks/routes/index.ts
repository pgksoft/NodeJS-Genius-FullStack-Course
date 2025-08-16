import { Router } from 'express'
import { taskList } from '../model/task-list'
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result/send-mutation-result'
import { isTaskDto } from '../entity'
import { getCrudResultError } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { taskCreate } from '../model/task-create'
import { taskUpdate } from '../model/task-update'
import { taskRemove } from '../model/task-remove'

const router = Router()

router.get('/', async (req, res) => {
  const result = await taskList()
  sendMutationResult(result, res)
})

router.post('/', async (req, res) => {
  const taskDto = req.body
  const isMutationTask = isTaskDto(taskDto)
  if (!isMutationTask) {
    return getCrudResultError(400)
  }
  const result = await taskCreate(taskDto)
  sendMutationResult(result, res)
})

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const taskDto = req.body
  const isMutationTask = isTaskDto(taskDto)
  if (!isMutationTask) {
    return getCrudResultError(400)
  }
  const result = await taskUpdate(id, taskDto)
  sendMutationResult(result, res)
})

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const result = await taskRemove(id)
  sendMutationResult(result, res)
})

export default router
