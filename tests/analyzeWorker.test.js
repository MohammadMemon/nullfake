const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getScore } = require('../src/workers/analyzeWorker');

describe('analyzeWorker getScore (stub)', () => {
  it('returns weighted mean as 0–100 integer', async () => {
    const score = await getScore([
      { signal: 'a', score: 0.5, weight: 1 },
      { signal: 'b', score: 1, weight: 1 },
    ]);
    assert.strictEqual(score, 75);
  });
});
