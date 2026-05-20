const app = require('./app');
const config = require('./config');
const db = require('../models/connection');

async function start() {
  await db.connect(config.mongodbUri);
  console.log('MongoDB connected');

  const server = app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    const { closeAnalyzeQueue } = require('../workers/queue');
    await closeAnalyzeQueue();
    server.close();
    await db.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});
