import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { aiStatus, analyzeCareer, chatCareer } from '../controllers/aiController.js';
const router = Router();
router.use(authMiddleware);
router.get('/status', aiStatus);
router.post('/analyze', analyzeCareer);
router.post('/chat', chatCareer);
export default router;
