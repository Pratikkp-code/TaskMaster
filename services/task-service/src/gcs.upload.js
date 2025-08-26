import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import MulterGoogleStorage from 'multer-google-storage';
import path from 'path';

// This automatically looks for the GOOGLE_APPLICATION_CREDENTIALS environment variable
// which we will set in the docker-compose.yml file.
const storage = new Storage();

export const uploadToGCS = multer({
  storage: MulterGoogleStorage.storageEngine({
    bucket: process.env.GCS_BUCKET_NAME,
    projectId: process.env.GCS_PROJECT_ID,
    // This makes the file publicly readable
    acl: 'publicRead',
    destination: (req, file, cb) => {
      cb(null, 'task-attachments/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
});
const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${req.file.filename}`;

const attachment = {
    url: publicUrl,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
};
