const mongoose = require('mongoose');
const Job = require('../models/Job');
const Result = require('../models/Result');

/** Stub: later download URL or read upload path. */
async function getInput(inputRef) {
  return { ref: inputRef };
}

/** Stub: later run HF models / frame_delta / metadata. */
async function getSignals(input) {
  return [{ signal: 'stub', score: 0.5, weight: 1 }];
}

/** Stub aggregate until `src/scoring/index.js` is implemented. */
async function getScore(signals) {
  const weightSum = signals.reduce((sum, s) => sum + (s.weight ?? 0), 0) || 1;
  const weighted = signals.reduce(
    (sum, s) => sum + s.score * (s.weight ?? 0),
    0,
  );
  const normalized = weighted / weightSum;
  return Math.round(normalized * 100);
}

function confidenceFromSignals(signals) {
  const scores = signals.map((s) => s.score);
  if (scores.length === 0) return 'low';
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((sum, x) => sum + (x - mean) ** 2, 0) / scores.length;
  if (variance < 0.1) return 'high';
  if (variance < 0.25) return 'medium';
  return 'low';
}

function verdictFromFinalScore(finalScore) {
  const p = finalScore / 100;
  if (p > 0.7) return 'likely_fake';
  if (p > 0.4) return 'uncertain';
  return 'likely_real';
}

/**
 * BullMQ passes the job instance; do not re-fetch from the queue by id.
 * @param {import('bullmq').Job} bullJob
 */
async function processAnalyzeJob(bullJob) {
  const { mongoJobId, inputRef } = bullJob.data;
  if (!mongoJobId || !inputRef) {
    throw new Error('Invalid job payload: expected mongoJobId and inputRef');
  }

  if (!mongoose.isValidObjectId(mongoJobId)) {
    throw new Error('Invalid mongoJobId');
  }

  await Job.findByIdAndUpdate(mongoJobId, {
    status: 'processing',
  });

  try {
    const input = await getInput(inputRef);
    const signals = await getSignals(input);
    const finalScore = await getScore(signals);
    const confidence = confidenceFromSignals(signals);
    const verdict = verdictFromFinalScore(finalScore);

    await Result.create({
      jobId: new mongoose.Types.ObjectId(mongoJobId),
      finalScore,
      confidence,
      verdict,
      signalBreakdown: signals.map((s) => ({
        signal: s.signal,
        score: s.score,
        weight: s.weight,
      })),
      frameCount: 0,
    });

    await Job.findByIdAndUpdate(mongoJobId, {
      status: 'done',
    });
  } catch (err) {
    await Job.findByIdAndUpdate(mongoJobId, {
      status: 'failed',
      errorMessage: String(err?.message || err),
    });
    throw err;
  }
}

module.exports = {
  processAnalyzeJob,
  getInput,
  getSignals,
  getScore,
};
