// src/routes/aiRoutes.js
import { Router } from 'express';
import {
  tutor,
  bugExplainer,
  errorTranslator,
  codeImprover,
  problem,
  history,
} from '../controllers/aiController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = Router();

// Tools work for everyone; logged-in users get history + XP.
router.post('/tutor', optionalProtect, tutor);
router.post('/bug-explainer', optionalProtect, bugExplainer);
router.post('/error-translator', optionalProtect, errorTranslator);
router.post('/code-improver', optionalProtect, codeImprover);
router.post('/problem', optionalProtect, problem);

// Personal history requires login.
router.get('/history', protect, history);

export default router;
