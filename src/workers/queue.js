const { Queue } = require('bullmq');
const { Redis } = require('ioredis');
const config = require('../api/config');

/** Matches HTTP `/analyze` naming. */
const QUEUE_NAME = 'analyze';

function createBullMqConnection() {
  return new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
  });
}

let analyzeQueue;

function getAnalyzeQueue() {
  if (!analyzeQueue) {
    analyzeQueue = new Queue(QUEUE_NAME, {
      connection: createBullMqConnection(),
    });
  }
  return analyzeQueue;
}

async function closeAnalyzeQueue() {
  if (analyzeQueue) {
    await analyzeQueue.close();
    analyzeQueue = undefined;
  }
}

module.exports = {
  QUEUE_NAME,
  getAnalyzeQueue,
  createBullMqConnection,
  closeAnalyzeQueue,
};
