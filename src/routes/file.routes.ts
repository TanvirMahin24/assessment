import { Router } from 'express';
import { FileUploadController } from '@/controllers/FileController';
import upload from '@/middleware/multer';

const router = Router();
const fileUploadController = new FileUploadController();

// Public routes
router.post('/upload', upload.single('file'), fileUploadController.upload);
router.post('/upload/many', upload.array('files',10), fileUploadController.uploadMany);
router.delete('/:id', fileUploadController.deleteFile);
router.get('/share/:token', fileUploadController.getFileUsingShareToken);
router.get('/:id', fileUploadController.getFiles);
router.get('/', fileUploadController.getFiles);

export default router;

