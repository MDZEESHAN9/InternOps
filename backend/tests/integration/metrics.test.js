const app = require('../../src/app');

describe('GET /metrics authentication', () => {
  const originalMetricsToken = process.env.METRICS_TOKEN;
  const metricsToken = 'test-metrics-token';

  afterAll(async () => {
    if (originalMetricsToken === undefined) {
      delete process.env.METRICS_TOKEN;
    } else {
      process.env.METRICS_TOKEN = originalMetricsToken;
    }

    await app.close();
  });

  it('returns 404 when METRICS_TOKEN is not configured', async () => {
    delete process.env.METRICS_TOKEN;

    const response = await app.inject({
      method: 'GET',
      url: '/metrics',
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 404 for an invalid metrics token', async () => {
    process.env.METRICS_TOKEN = metricsToken;

    const response = await app.inject({
      method: 'GET',
      url: '/metrics',
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns metrics for the configured metrics token', async () => {
    process.env.METRICS_TOKEN = metricsToken;

    const response = await app.inject({
      method: 'GET',
      url: '/metrics',
      headers: {
        authorization: `Bearer ${metricsToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
  });
});
