import sendMutationResult from '@helpers/send-mutation-result';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { withAbility } from '@middleware/with-ability';
import { Router } from 'express';
import { taskStatusCreate } from '../control/tasks-status-create';
import { isTaskStatusDto } from '../model';
import { taskStatusList } from '../control/task-status-list';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { taskStatusUpdate } from '../control/task-status-update';
import { taskStatusRemove } from '../control/task-status-remove';

const router = Router();

/**
 * @openapi
 * /api/task-status-dic:
 *   get:
 *     tags: [TaskStatusDic]
 *     summary: Get task status dictionary
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task status dictionary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatusDic'
 */
router.get('/', withAbility('taskStatusDic', 'readList'), async (req, res) => {
  const result = await taskStatusList(req.abilityAccess.filter);
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/task-status-dic:
 *   post:
 *     tags: [TaskStatusDic]
 *     summary: Create a new task status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskStatusDto'
 *     security:
 *       - basicAuth: []
 *     responses:
 *       201:
 *         description: Task status successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatus'
 *       400:
 *         description: Invalid input
 */
router.post('/', withAbility('taskStatusDic', 'create'), async (req, res) => {
  const taskStatusDto = req.body;
  const isMutationTaskStatus = isTaskStatusDto(taskStatusDto);
  if (!isMutationTaskStatus) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await taskStatusCreate(taskStatusDto, req.user!._id);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/task-status-dic/{id}:
 *   put:
 *     tags: [TaskStatusDic]
 *     summary: Update an existing task status
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
 *             $ref: '#/components/schemas/TaskStatusDto'
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatus'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Task not found
 */
router.put('/:id', withAbility('taskStatusDic', 'update'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const taskStatusDto = req.body;
  const isMutationTaskStatus = isTaskStatusDto(taskStatusDto);
  if (!isMutationTaskStatus) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await taskStatusUpdate(id, taskStatusDto, req.user!._id);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/task-status-dic/{id}:
 *   delete:
 *     tags: [TaskStatusDic]
 *     summary: Delete a task status
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
 *         description: Task status not found
 */
router.delete('/:id', withAbility('taskStatusDic', 'delete'), async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await taskStatusRemove(id, req.abilityAccess.filter);
  return sendMutationResult(result, res);
});

export default router;
