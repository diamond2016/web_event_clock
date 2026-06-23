import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Web Event Clock API',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/documentation',
    uiConfig: { docExpansion: 'list' },
  });
});