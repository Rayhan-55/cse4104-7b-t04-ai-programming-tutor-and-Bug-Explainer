// src/routes/docRoutes.js
import { Router } from 'express';
import multer from 'multer';
import { explainDoc } from '../controllers/docController.js';
import { optionalProtect } from '../middleware/auth.js';

// Keep the uploaded file in memory only (never written to disk).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/');
    cb(ok ? null : new Error('Only PDF and image files are allowed.'), ok);
  },
});

const router = Router();
router.post('/explain', optionalProtect, upload.single('file'), explainDoc);

export default router;
