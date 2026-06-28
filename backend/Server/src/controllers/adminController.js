// src/controllers/adminController.js
import User from '../models/User.js';
import ChatHistory from '../models/ChatHistory.js';
import WeakTopic from '../models/WeakTopic.js';
import { isDBReady } from '../config/db.js';

function requireDB(res) {
  if (!isDBReady()) {
    res.status(503).json({ message: 'Database not connected. Set MONGO_URI to use the admin panel.' });
    return false;
  }
  return true;
}

// GET /api/admin/stats
export async function stats(req, res) {
  if (!requireDB(res)) return;

  const [userCount, adminCount, activityCount, byFeature, topUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    ChatHistory.countDocuments(),
    ChatHistory.aggregate([{ $group: { _id: '$feature', count: { $sum: 1 } } }]),
    User.find().sort({ xp: -1 }).limit(5).select('name xp level'),
  ]);

  res.json({
    users: userCount,
    admins: adminCount,
    activities: activityCount,
    byFeature: byFeature.map((f) => ({ feature: f._id, count: f.count })),
    topUsers,
  });
}

// GET /api/admin/users
export async function listUsers(req, res) {
  if (!requireDB(res)) return;
  const users = await User.find().sort({ createdAt: -1 }).limit(200);
  res.json({ users: users.map((u) => u.toSafeJSON()) });
}

// GET /api/admin/activity
export async function recentActivity(req, res) {
  if (!requireDB(res)) return;
  const items = await ChatHistory.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('userId', 'name email');
  res.json({ activity: items });
}

// PATCH /api/admin/users/:id/role   body: { role }
export async function setRole(req, res) {
  if (!requireDB(res)) return;
  const { role } = req.body;
  if (!['student', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'role must be "student" or "admin"' });
  }
  // Prevent an admin from removing their own admin access by accident.
  if (String(req.params.id) === String(req.user._id) && role !== 'admin') {
    return res.status(400).json({ message: "You can't remove your own admin access." });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: user.toSafeJSON() });
}
