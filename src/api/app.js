const express = require('express');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const analyzeRouter = require('./routes/analyze');
const jobsRouter = require('./routes/jobs');
app.use('/analyze', analyzeRouter);
app.use('/jobs', jobsRouter);

module.exports = app;
