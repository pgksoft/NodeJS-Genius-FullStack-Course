import multer from 'multer'
import { config } from '../app-config'

export const MULTER_REQUEST_KEY = 'demo-image'

// export const upload = multer({ dest: config.multerDestination }).single(
//   MULTER_REQUEST_KEY,
// )

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.multerDestination)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

// export const upload = multer({ storage }).single(MULTER_REQUEST_KEY)

export const uploadSingle = multer({ storage, limits: { fileSize: 1000000 } }).single(
  MULTER_REQUEST_KEY,
)

export const uploadMultiple = multer({ storage, limits: { fileSize: 1000000 } })
