// src/middleware/errorHandler.js

// 404 handler — runs when no route matched.
export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// Central error handler — keeps controllers clean (they just throw).
export function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);

  // Friendlier messages for file-upload (multer) errors.
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File is too large (max 8 MB).' });
  }
  if (err.message && err.message.includes('Only PDF and image')) {
    return res.status(415).json({ message: err.message });
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
