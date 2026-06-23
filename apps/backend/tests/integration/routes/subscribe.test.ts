import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import subscribeRoutes from '#/routes/api/subscribe.js';
import natsPlugin from '#/plugins/nats.js';
import { ResponsePayload } from '@web-event-clock/shared';

 describe('Backend API - Subscribe', () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(natsPlugin);
    await app.register(subscribeRoutes, { prefix: '/api' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 201 Created on successful subscription', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/subscribe/hhmm',
    });

    const payload = response.json() as ResponsePayload;
    expect(response.statusCode).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.message).toBe('subscribe hhmm');
  });

  it('should return 400 on invalid channel', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/subscribe/invalid-channel',
    });
    const payload1 = response.json() as ResponsePayload;
    expect(response.statusCode).toBe(400);
    expect(payload1.success).toBe(false);
  });

})
