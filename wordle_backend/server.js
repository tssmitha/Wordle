import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import gameRoutes from './src/routes/game_routes.js'
import authRoutes from './src/routes/auth.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/wordle_2';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

console.log("ENV TEST:", process.env.MONGO_URI);
console.log("ENV TEST:", process.env.JWT_SECRET);


mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

  app.use('/api/game',gameRoutes);
  app.use('/api/auth',authRoutes);

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
