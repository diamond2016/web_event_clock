import fp from 'fastify-plugin';
import { connect, type NatsConnection } from '@nats-io/transport-node';
import type { FastifyPluginAsync } from 'fastify';

const natsPlugin: FastifyPluginAsync = async (fastify) => {
  const nc = await connect({
    servers: process.env.NATS_SERVERS?.split(',') || ['nats://0.0.0.0:4222'],
    name: 'web-event-clock-gateway',
    reconnect: true,
    maxReconnectAttempts: -1,
    timeout: 5000,
  });

  fastify.decorate('nc', nc);

  fastify.addHook('onClose', async () => {
    await nc.close();
    fastify.log.info('NATS connection closed');
  });

  fastify.log.info('✅ Connected to NATS (new client)');
};

export default fp(natsPlugin, { name: 'nats' });