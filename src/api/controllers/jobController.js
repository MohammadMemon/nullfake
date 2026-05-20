const mongoose = require('mongoose');
const Job = require('../../models/Job');
const Result = require('../../models/Result');


async function getJob(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: 'invalid job id' });
    return;
  }

  try {
    const job = await Job.findById(id).lean();
    if (!job) {
      res.status(404).json({ error: 'job not found' });
      return;
    }

    const result = await Result.findOne({ jobId: id }).lean();
    res.json({ job, result });
  } catch (err) {
    console.error('GET /jobs/:id', err);
    res.status(500).json({ error: 'failed to load job' });
  }
}

module.exports = {
  getJob,
};
