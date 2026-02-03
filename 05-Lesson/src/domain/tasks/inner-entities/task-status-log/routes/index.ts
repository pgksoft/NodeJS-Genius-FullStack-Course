import { withAbility } from '@middleware/with-ability';
import { Router } from 'express';
import { taskStatusLogList } from '../control/task-status-log-list';
import sendMutationResult from '@helpers/send-mutation-result';
import { logger } from '@logger/index';

const router = Router();

/**
 * @openapi
 * /api/task-status-log:
 *   get:
 *     tags: [TaskStatusLog]
 *     summary: Get log
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Task status log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksStatusLog'
 */
router.get('/', withAbility('taskStatusLog', 'readList'), async (req, res) => {
  const filter = { ...req.abilityAccess.filter, ...req.query };
  logger.debug(filter, 'taskStatusLog readList');
  const result = await taskStatusLogList(filter);
  sendMutationResult(result, res);
});

export default router;
