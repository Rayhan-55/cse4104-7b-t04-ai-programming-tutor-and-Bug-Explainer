// src/routes/repoRoutes.js
import { Router } from 'express';
import { overview, file } from '../controllers/repoController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = Router();

router.post('/overview', optionalProtect, overview);
router.post('/file', optionalProtect, file);

export default router;
