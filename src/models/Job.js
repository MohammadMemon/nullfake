const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    idempotencyKey: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'failed'],
      required: true,
      default: 'pending',
    },
    inputType: {
      type: String,
      enum: ['url', 'upload'],
      required: true,
      default: 'url',
    },
    inputRef: {
      type: String,
      required: true,
      trim: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'jobs',
  },
);

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
