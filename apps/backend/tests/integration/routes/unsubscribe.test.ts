import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import unSubscribeRoutes from '#/routes/api/unsubscribe.js';
import natsPlugin from '#/plugins/nats.js';
import { ResponsePayload } from '@web-event-clock/shared';

 describe('Backend API - Subscribe', () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(natsPlugin);
    await app.register(unSubscribeRoutes, { prefix: '/api' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 on successful unsubscription', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/unsubscribe/hhmm',
    });

    const payload = response.json() as ResponsePayload;
    expect(response.statusCode).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.message).toBe('unsubscribe hhmm');
  });

  it('should return 400 on invalid channel', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/unsubscribe/invalid-channel',
    });

    expect(response.statusCode).toBe(400);
  });

})
