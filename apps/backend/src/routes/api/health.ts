import { FastifyInstance } from 'fastify';


export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const isNatsConnected = !!(fastify as any).nc?.connected;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      nats: isNatsConnected,
    };
  });
}