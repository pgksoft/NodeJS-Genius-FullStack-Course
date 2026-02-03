import { Router } from 'express';
import { getCrudResultError } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { taskCreate } from '../control/task-create';
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result';
import { taskList } from '../control/task-list';
import { taskUpdate } from '../control/task-update';
import { isStrictValidObjectId } from '../../../db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '../../../db/const/mongodb_title';
import { task } from '../control/task';
import { taskRemove } from '../control/task-remove';
import { withAbility } from '@middleware/with-ability';
import type { TAppAction } from '@infra/app-entities/app-entity-types/t-entity-actions';
import { isTaskChangeStatusDto } from '../inner-entities/task-status-log/model';
import { taskChangeStatus } from '../control/task-status-change';
import { isTaskUpdateDto } from '../model/services/is-task-update-dto';
import { isTaskCreateDto } from '../model/services/is-task-create-dto';

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get tasks
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskList'
 */
router.get('/', withAbility('task', 'readList'), async (req, res) => {
  const result = await taskList(req.abilityAccess.filter);
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: The task has been found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Incorrect ID
 *       404:
 *         description: Task not found
 */
router.get('/:id', withAbility('task', 'readOne'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await task(id);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateDto'
 *     security:
 *       - basicAuth: []
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 */
router.post('/', withAbility('task', 'create'), async (req, res) => {
  const taskCreateDto = req.body;
  const isMutationTask = isTaskCreateDto(taskCreateDto);
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await taskCreate(taskCreateDto, req.user!._id);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/tasks/{id}/task-change-status:
 *   put:
 *     tags: [Tasks]
 *     summary: Change an existing task status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskChangeStatusDto'
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Task not found or Task status not found
 */
const taskChangeStatusPath = `/:id/${'task-change-status' satisfies TAppAction}`;
router.post(taskChangeStatusPath, withAbility('task', 'task-change-status'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const taskChangeStatusDto = req.body;
  const isMutationTask = isTaskChangeStatusDto(taskChangeStatusDto);
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const { taskStatusId, comment } = taskChangeStatusDto;
  const result = await taskChangeStatus({
    taskId: id,
    statusId: taskStatusId.toString(),
    userId: req.user!._id.toString(),
    comment,
  });
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateDto'
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Task not found
 */
router.put('/:id', withAbility('task', 'update'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const taskUpdateDto = req.body;
  const isMutationTask = isTaskUpdateDto(taskUpdateDto);
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await taskUpdate(id, taskUpdateDto, req.user!._id);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Task not found
 */
router.delete('/:id', withAbility('task', 'delete'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await taskRemove(id, req.abilityAccess.filter);
  return sendMutationResult(result, res);
});

export default router;
