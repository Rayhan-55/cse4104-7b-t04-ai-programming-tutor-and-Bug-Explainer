// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDBReady } from '../config/db.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Emails listed in ADMIN_EMAILS (comma-separated) automatically become admins.
// This lets you create the first admin without editing the database by hand.
function isAdminEmail(email) {
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes((email || '').toLowerCase());
}

function requireDB(res) {
  if (!isDBReady()) {
    res.status(503).json({
      message: 'Database not connected. Set MONGO_URI in server/.env to enable accounts.',
    });
    return false;
  }
  return true;
}

// POST /api/auth/register
export async function register(req, res) {
  if (!requireDB(res)) return;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const role = isAdminEmail(email) ? 'admin' : 'student';
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ user: user.toSafeJSON(), token: signToken(user._id) });
}

// POST /api/auth/login
export async function login(req, res) {
  if (!requireDB(res)) return;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Keep admin status in sync with ADMIN_EMAILS.
  if (isAdminEmail(email) && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }

  res.json({ user: user.toSafeJSON(), token: signToken(user._id) });
}

// GET /api/auth/me  (protected)
export async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}
