import { Router } from 'express';
import sendMutationResult from '../../../../app-infrastructure/app-helpers/send-mutation-result';
import { isUserLogin } from '../../model';
import { getCrudResultError } from '../../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { userLogin } from '../../control/user-login';

const router = Router();

/**
 * @openapi
 * /api/login-user:
 *   post:
 *     tags: [Login user]
 *     summary: User authorization
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCrypt'
 */
router.post('/', async (req, res) => {
  const dataLogin = req.body;
  if (!isUserLogin(dataLogin)) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await userLogin(dataLogin);
  return sendMutationResult(result, res);
});

export default router;
