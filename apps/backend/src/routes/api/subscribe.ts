import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { ChannelSchema } from '../../schemas/channel_dto.js';
import { SubscribeResponseSchema } from '../../schemas/subscribe_dto.js';
import { TimeServiceClient } from '../../nats/time-service-client.js';

/*
POST /api/subscribe/{channel}
Parameter: channel:
  channel: hhmm | hhmmss
Response: 
  success: true | false
  message: string      
*/

export default async function subscribeRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/subscribe/:channel',
    {
      schema: {
        params: ChannelSchema,
        response: { // Note: in Fastify 'response' (o 201), not 'reply'
          201: SubscribeResponseSchema,
          400: SubscribeResponseSchema,
          500: SubscribeResponseSchema
        }
      },
    },
    async (request: FastifyRequest<{ Params: { channel: string } }>, reply: FastifyReply) => {
      // 1. destructuring 'channel' from object request.params
      const { channel } = request.params; 

      try {
        switch (channel) {
          case 'hhmm':
            await TimeServiceClient.subscribeHHMM(fastify); 
            break;
          case 'hhmmss':
            await TimeServiceClient.subscribeHHMMSS(fastify);
            break;
          default:
            // channel not correct
            return reply.status(400).send({
              success: false,
              message: `Unsupported channel: ${channel}. Only 'hhmm' and 'hhmmss' are supported.`
            });
          }

        return reply.status(201).send({
        "success": true,
        "message": `subscribe ${channel}`
      });
      } catch (err: unknown) {
        return reply.status(500).send({
          "success": false,
          "message": `error in subscribe ${channel} ${ (err as Error).message }`
        });
      }
    }
  )
}

