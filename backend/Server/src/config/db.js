import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('[db] MONGO_URI not set — running WITHOUT a database. Auth & history will not persist.');
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log('[db] MongoDB connected');
    return true;
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    return false;
  }
}

export function isDBReady() {
  return mongoose.connection.readyState === 1;
}
