import { withAbility } from '@middleware/with-ability';
import { Router } from 'express';
import { userList } from '../control/user-list';
import sendMutationResult from '@helpers/send-mutation-result';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get users
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 */
router.get('/', withAbility('user', 'readList'), async (req, res) => {
  const result = await userList(req.abilityAccess.filter);
  sendMutationResult(result, res);
});

export default router;
