const mongoose = require('mongoose');

const signalBreakdownSchema = new mongoose.Schema(
  {
    signal: { type: String, required: true },
    score: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    finalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    verdict: {
      type: String,
      enum: ['likely_real', 'uncertain', 'likely_fake'],
      required: true,
    },
    signalBreakdown: {
      type: [signalBreakdownSchema],
      default: [],
    },
    frameCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    processedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    collection: 'results',
  },
);

module.exports =
  mongoose.models.Result || mongoose.model('Result', resultSchema);
