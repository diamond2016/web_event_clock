import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import healthRoutes from '#/routes/api/health.ts';
import { FastifyInstance } from 'fastify';

describe('Health Route', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(healthRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: 'ok',
      nats: expect.any(Boolean)
    });
  });
});