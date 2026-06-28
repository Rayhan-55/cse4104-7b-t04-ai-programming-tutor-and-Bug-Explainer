// src/routes/adminRoutes.js
import { Router } from 'express';
import { stats, listUsers, recentActivity, setRole } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Every admin route requires a logged-in admin.
router.use(protect, adminOnly);

router.get('/stats', stats);
router.get('/users', listUsers);
router.get('/activity', recentActivity);
router.patch('/users/:id/role', setRole);

export default router;
