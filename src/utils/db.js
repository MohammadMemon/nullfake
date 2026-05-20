const mongoose = require('mongoose');

async function connect(uri) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  await mongoose.connect(uri);
  await mongoose.connection.db.admin().command({ ping: 1 });
  return mongoose.connection;
}

async function disconnect() {
  await mongoose.disconnect();
}

function getDb() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB not connected. Call connect() first.');
  }
  return mongoose.connection.db;
}

function getClient() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB not connected. Call connect() first.');
  }
  return mongoose.connection.getClient();
}

module.exports = {
  connect,
  disconnect,
  getDb,
  getClient,
};
