import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import Fastify from 'fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import setClockRoutes from '#/routes/api/set-clock.js';
import natsPlugin from '#/plugins/nats.js';
import { vi as viModule } from 'vitest';

// Mock nrequest to avoid needing a real NATS server
vi.mock('#/nats/nrequest.js', () => ({
  nrequest: vi.fn((nc, subject, payload) => {
    return Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        message: 'mocked response'
      }),
    });
  }),
}));

import { nrequest } from '#/nats/nrequest.js';

describe('Backend API - Set Clock', () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // We mock the natsPlugin or its effects if necessary. 
    // Since we are mocking nrequest, we just need the plugin to be registered.
    await app.register(natsPlugin);
    await app.register(setClockRoutes, { prefix: '/api' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 on successful set-clock', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/set.clock',
      payload: {
        time: '12:30:00',
        mode: 'absolute',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json() as any;
    expect(payload.success).toBe(true);
    expect(payload.message).toBe('set time at 12:30:00');
    
    // Verify nrequest was called with correct arguments
    expect(nrequest).toHaveBeenCalledWith(
      expect.anything(),
      'set.clock',
      { time: '12:30:00', mode: 'absolute' }
    );
  });

  it('should return 400 on invalid time format', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/set.clock',
      payload: {
        time: 'invalid-time',
        mode: 'absolute',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 on invalid mode', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/set.clock',
      payload: {
        time: '12:30:00',
        mode: 'invalid-mode',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 500 when nrequest fails', async () => {
    // Override the mock for this specific test
    vi.mocked(nrequest).mockRejectedValueOnce(new Error('NATS connection failed'));

    const response = await app.inject({
      method: 'POST',
      url: '/api/set.clock',
      payload: {
        time: '12:30:00',
        mode: 'absolute',
      },
    });

    expect(response.statusCode).toBe(500);
    const payload = response.json() as any;
    expect(payload.success).toBe(false);
    expect(payload.message).toContain('error: NATS connection failed');
  });
});
