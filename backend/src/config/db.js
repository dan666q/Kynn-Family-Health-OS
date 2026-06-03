const mongoose = require('mongoose');
const env = require('./env');

module.exports = {
  connect: async () => {
    try {
      console.log('[Kynn DB] Connecting to MongoDB...');
      await mongoose.connect(env.MONGO_URI);
      console.log('[Kynn DB] MongoDB connected successfully.');
    } catch (err) {
      console.error('[Kynn DB] MongoDB connection error:', err);
      throw err;
    }
  }
};

