import { Router } from 'express'
import { isTaskDto } from '../model'
import { getCrudResultError } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { taskCreate } from '../crud/task-create'
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result'
import { taskList } from '../crud/task-list'
import { taskUpdate } from '../crud/task-update'
import { isStrictValidObjectId } from '../../../db/is-strict-valid-object-id'
import { MONGODB_TITLE } from '../../../db/const/mongodb_title'
import { task } from '../crud/task'
import { taskRemove } from '../crud/task-remove'

const router = Router()

router.get('/', async (req, res) => {
  const result = await taskList()
  sendMutationResult(result, res)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(
      getCrudResultError(400, MONGODB_TITLE.invalidId),
      res,
    )
  }
  const result = await task(id)
  sendMutationResult(result, res)
})

router.post('/', async (req, res) => {
  const taskDto = req.body
  const isMutationTask = isTaskDto(taskDto)
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  const result = await taskCreate(taskDto)
  sendMutationResult(result, res)
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(
      getCrudResultError(400, MONGODB_TITLE.invalidId),
      res,
    )
  }
  const taskDto = req.body
  const isMutationTask = isTaskDto(taskDto)
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  const result = await taskUpdate(id, taskDto)
  sendMutationResult(result, res)
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(
      getCrudResultError(400, MONGODB_TITLE.invalidId),
      res,
    )
  }
  const result = await taskRemove(id)
  sendMutationResult(result, res)
})

export default router
