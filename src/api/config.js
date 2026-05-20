require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  mongodbUri:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/nullfake',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  hfApiToken: process.env.HF_API_TOKEN,
};
