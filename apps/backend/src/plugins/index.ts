import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { type Server } from 'socket.io';
import { type NatsConnection } from '@nats-io/transport-node';
import type { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    nc: NatsConnection;
    io: Server
  }
}

const plugins: FastifyPluginAsync = async (fastify) => {
  // Core plugins
  await fastify.register(cors, {
    origin: '*',
  });

  await fastify.register(helmet);
  await fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // NATS
  const natsPlugin = await import('./nats.js');
  await fastify.register(natsPlugin.default);
  
  // Swagger
  const swaggerPlugin = await import('./swagger.js');
  await fastify.register(swaggerPlugin.default);

  // SocketIO 
  const socketPlugin = await import('./socket.js');
  await fastify.register(socketPlugin.default);
};

export default fp(plugins);