/*
POST /api/set.clock
Boby:
  time: hh:mm:ss
  mode: it is forced to absolute (normal clock)
Response: 
  success: true | false
  message: string       
*/

import { FastifyInstance } from 'fastify';

import { SetRequestSchema, SetResponseSchema } from '../../schemas/set_dto.js';
import { SetRequestPayload, SetResponsePayload } from '@web-event-clock/shared';

import { nrequest } from '../../nats/nrequest.js';

export default async function setClockRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/set.clock', 
    {
      schema: {
        body: SetRequestSchema,
        response: {
          200: SetResponseSchema,
          500: SetResponseSchema
        }
      }
    },
    async (request, reply) => {
      // Recupero corretto dei dati
      const data = request.body as SetRequestPayload;
      console.log(data);

      try {
        await nrequest<SetRequestPayload, SetResponsePayload>(fastify.nc, 'set.clock', data);

        return reply.status(200).send({
          success: true,
          message: `set time at ${ data.time}`,
        });
      } catch (err) {
        return reply.status(500).send({
          success: false,
          message: `error: ${ (err as Error).message }`,
        });
      }
    }
  );
}
