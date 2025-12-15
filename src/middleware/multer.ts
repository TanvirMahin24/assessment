import multer from 'multer';
import { Request } from 'express';
import * as path from 'path';

// Define the storage engine
const storage = multer.diskStorage({
  
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Specify the destination directory for uploaded files
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate a unique filename using the original name and a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },

});

// Create the Multer middleware instance
const upload = multer({ storage: storage });

export default upload;