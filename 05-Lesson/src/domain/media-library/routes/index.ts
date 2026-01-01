import { Router } from 'express';
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result';
import { mediaCreate } from '../control/media-create';
import { uploadSingle } from '../../../app-infrastructure/multer';
import { mediaList } from '../control/media-list';
import { withAbility } from '@middleware/with-ability';
import { createValidator } from '../helpers/create-validator';
import { updateValidator } from '../helpers/update-validator';
import { mediaUpdate } from '../control/media-update';

const router = Router();

/**
 * @openapi
 * /api/media-library:
 *   get:
 *     tags: [MediaLibrary]
 *     summary: Get of downloaded media files
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: List of downloaded media files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItemList'
 */
router.get('/', withAbility('mediaLibrary', 'readList'), async (req, res) => {
  const result = await mediaList(req.abilityAccess.filter);
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/media-library:
 *   post:
 *     tags: [MediaLibrary]
 *     summary: Upload a file
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/MediaDto'
 *     responses:
 *       201:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItem'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  withAbility('mediaLibrary', 'create'),
  uploadSingle,
  createValidator,
  async (req, res) => {
    const { filename, originalname, path, size, mimetype } = req.file!;
    const result = await mediaCreate(
      { ...req.body, file: filename },
      { mimetype, originalname, path, size },
      req.user!._id,
    );
    return sendMutationResult(result, res);
  },
);

/**
 * @openapi
 * /api/media-library/{id}:
 *   put:
 *     tags: [MediaLibrary]
 *     summary: Update an existing file and/or its description
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: |
 *         **Rules for MediaUpdateDto:**
 *         - At least one of `description` or `file` must be provided
 *         - Both fields may be used together
 *         - `description` is plain text, while `file` is a binary upload
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/MediaUpdateDto'
 *     responses:
 *       201:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItem'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Remove old file error
 */
router.put(
  '/:id',
  withAbility('mediaLibrary', 'update'),
  uploadSingle,
  updateValidator,
  mediaUpdate,
);

export default router;
