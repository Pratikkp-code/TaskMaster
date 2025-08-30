import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';

// 1. Initialize Google Cloud Storage with credentials
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// 2. Get a reference to your bucket
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// 3. Configure Multer to store files in memory first
// This is a temporary holding area before we stream to GCS.
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});

const uploadToGCS = (req, res, next) => {

  multerUpload.single('attachment')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }


    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const blobName = `attachments/${req.params.id}-${uniqueSuffix}${path.extname(req.file.originalname)}`;
    

    const blob = bucket.file(blobName);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('GCS Stream Error:', err);
      next(err);
    });

    blobStream.on('finish', () => {
      req.file.publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      req.file.gcsFileName = blob.name;
      next();
    });


    blobStream.end(req.file.buffer);
  });
};

export default uploadToGCS;