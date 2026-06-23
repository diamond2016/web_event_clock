import { FastifyInstance } from 'fastify';

import { subscribe } from './subscribe.js';
import { unsubscribe } from './unsubscribe.js';
import { nrequest } from "./nrequest.js";

import {
  type ClockEvent,
  type SetRequestPayload,
  type SetResponsePayload,
} from "@web-event-clock/shared";

export class TimeServiceClient {
  // ====================== SUBSCRIBE ================= ==========
  // Changed: Added io parameter, removed handler parameter
  public static async subscribeHHMM(fastify: FastifyInstance): Promise<void> {
    await subscribe<ClockEvent>(fastify.nc, "hhmm", (payload) => {
      //fastify.log.info(`emit hhmm - ${ JSON.stringify(payload) }`);
      fastify.io.emit('clock_update_hhmm', JSON.stringify(payload));
    });
  }
  
  // Changed: Added io parameter, removed handler parameter
  public static async subscribeHHMMSS(fastify: FastifyInstance): Promise<void> {
    await subscribe<ClockEvent>(fastify.nc, "hhmmss", (payload) => {
      // fastify.log.info(`emit hhmmss - ${ JSON.stringify(payload) }`);
      fastify.io.emit('clock_update_hhmmss', JSON.stringify(payload));
    });
  }

  public static async unsubscribeHHMM(fastify: FastifyInstance): Promise<void> {
    await unsubscribe(fastify.nc, "hhmm");
  }

  public static async unsubscribeHHMMSS(fastify: FastifyInstance): Promise<void> {
    await unsubscribe(fastify.nc, "hhmmss");
  }

  // ====================== REQUEST / REPLY ================= ==========
  // set-clock time hh:mm:ss mode 'absolute'
  public static async setClock(fastify: FastifyInstance, time: string): Promise<SetResponsePayload> {
      const payload: SetRequestPayload = { "time": time, "mode": 'absolute' };
      return await nrequest<SetRequestPayload, SetResponsePayload>(
      fastify.nc, 
      'set.clock',
      payload,
    );
  }

  public static async startTimer(fastify: FastifyInstance): Promise<SetResponsePayload> {
  // set-timer time '00:00:00' mode 'relative'
      const payload: SetRequestPayload = { "time": '00:00:00', "mode": 'relative' };
      return await nrequest<SetRequestPayload, SetResponsePayload>(
      fastify.nc,
      'start.timer', 
      payload,
    );
  }
  

  public static async stopTimer(fastify: FastifyInstance): Promise<SetResponsePayload> {
  // stop-timer time '00:00:00' mode 'relative'
      const payload: SetRequestPayload = { "time": '00:00:00', "mode": 'relative' };
      return await nrequest<SetRequestPayload, SetResponsePayload>(
      fastify.nc, 
      'stop.timer',
      payload,
    );
  }
}

