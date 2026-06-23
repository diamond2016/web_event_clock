/*
POST /api/start.timer
Boby:
  time: hh:mm:ss (it starts at hh:mm:ss e.g. 00:00:00)
  mode: it is forced to relative
Response: 
  success: true | false
  message: string       // operation requested: set hh:mm:ss or error
*/

import { FastifyInstance } from 'fastify';

import { SetRequestSchema, SetResponseSchema } from '../../schemas/set_dto.js';
import { SetRequestPayload, SetResponsePayload } from '@web-event-clock/shared';

import { nrequest } from '../../nats/nrequest.js';

// Wrap both routes into one plugin function
export default async function timerRoutes(fastify: FastifyInstance) {

  fastify.post(
    '/start.timer', 
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
      console.log(`/start.timer ${request.log} ${reply.log}`)
      try {
        await nrequest<SetRequestPayload, SetResponsePayload>(fastify.nc, 'start.timer',data);

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

/*
POST /api/stop.timer
Boby:
  time: hh:mm:ss
  mode: absolute | relative
Response: 
  success: true | false
  message: string       // operation requested: set hh:mm:ss or error
*/

  fastify.post(
    '/stop.timer', 
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
      console.log(`/start.timer ${request.log} ${reply.log}`)
      try {
        await nrequest<SetRequestPayload, SetResponsePayload>(fastify.nc, 'stop.timer', data);

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
} // timerRoutes

