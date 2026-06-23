/*
POST /api/publish/{channel}
Boby:
  time: hh:mm:ss
  mode: absolute | relative
Response: 
  success: true | false
  message: string       
*/

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SetRequestPayload } from '@web-event-clock/shared';
import { ChannelSchema } from '../../schemas/channel_dto.js';
import { PublishRequestSchema, PublishResponseSchema } from '../../schemas/publish_dto.js';

import { publish } from '../../nats/publish.js';
import { ZodString } from 'zod';

export default async function publishRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/publish/:channel', // Aggiunto il parametro dinamico
    {
      schema: {
        params: ChannelSchema, // Validazione del parametro URL
        body: PublishRequestSchema,
        response: {
          200: PublishResponseSchema,
          500: PublishResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { channel: string } }>, reply: FastifyReply) => {
      // Recupero corretto dei dati
      const { channel } = request.params; // Now TypeScript knows the type
      const data = request.body as SetRequestPayload;

      try {
        await publish<SetRequestPayload>(fastify.nc, channel, data);

        return reply.status(200).send({
          success: true,
          message: `publish on ${channel}`,
          currentTime: new Date().toLocaleTimeString() 
        });
      } catch (err) {
        return reply.status(500).send({
          success: false,
          message: `error: ${ (err as Error).message }`,
          currentTime: ""
        });
      }
    }
  );
}