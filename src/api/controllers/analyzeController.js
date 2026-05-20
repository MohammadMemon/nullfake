const { getAnalyzeQueue } = require('../../workers/queue');
const Job = require('../../models/Job');

async function createAnalyze(req, res) {
  const inputType = req.body?.inputType === 'upload' ? 'upload' : 'url';
  const inputRef =
    typeof req.body?.inputRef === 'string' ? req.body.inputRef.trim() : '';

  if (!inputRef) {
    res.status(400).json({ error: 'inputRef is required' });
    return;
  }

  try {
    const job = await Job.create({
      status: 'pending',
      inputType,
      inputRef,
      attempts: 0,
    });

    await getAnalyzeQueue().add(
      'analyze',
      { mongoJobId: job._id.toString(), inputRef },
      { jobId: job._id.toString() },
    );

    res.status(202).json({ jobId: job._id.toString() });
  } catch (err) {
    console.error('POST /analyze', err);
    res.status(500).json({ error: 'failed to enqueue job' });
  }
}

module.exports = {
  createAnalyze,
};
