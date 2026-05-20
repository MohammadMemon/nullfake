const { Redis } = require('ioredis');
const config = require('../api/config');

const redis = new Redis(config.redisUrl);

module.exports = redis;
