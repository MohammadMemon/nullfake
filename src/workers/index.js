const { Worker } = require('bullmq');
const config = require('../api/config');
const db = require('../models/connection');
const { QUEUE_NAME, createBullMqConnection } = require('./queue');
const { processAnalyzeJob } = require('./analyzeWorker');

let worker;

async function start() {
  await db.connect(config.mongodbUri);
  console.log('MongoDB connected');

  worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      console.log('Processing job', job.id, job.data);
      await processAnalyzeJob(job);
      console.log('Completed job', job.id);
    },
    { connection: createBullMqConnection() },
  );

  worker.on('failed', (job, err) => {
    console.error('Job failed', job?.id, err);
  });

  console.log('BullMQ worker listening on queue', QUEUE_NAME);
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down worker`);
  if (worker) {
    await worker.close();
    worker = undefined;
  }
  await db.disconnect();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((err) => {
  console.error('Failed to start worker:', err);
  process.exit(1);
});
