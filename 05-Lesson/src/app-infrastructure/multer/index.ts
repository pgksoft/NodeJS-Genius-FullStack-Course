import multer from 'multer';
import { config } from '../../../settings-core/env';

export const MULTER_REQUEST_KEY = 'file';

// export const upload = multer({ dest: config.multerDestination }).single(
//   MULTER_REQUEST_KEY,
// )

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.multerDestination);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user?._id}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// export const upload = multer({ storage }).single(MULTER_REQUEST_KEY)

const fileSize = 100 * 1024 * 1024;
export const uploadSingle = multer({ storage, limits: { fileSize } }).single(MULTER_REQUEST_KEY);

export const uploadMultiple = multer({ storage, limits: { fileSize } });
