import { Router } from 'express';
import filesRoute from './file.routes';

const router = Router();

router.use('/files', filesRoute);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;

