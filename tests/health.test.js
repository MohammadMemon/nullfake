const { describe, it } = require('node:test');
const assert = require('node:assert');
const app = require('../src/api/app');

describe('GET /health', () => {
  it('returns ok', async () => {
    const server = app.listen(0);
    const { port } = server.address();

    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.deepStrictEqual(body, { status: 'ok' });
    } finally {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  });
});
