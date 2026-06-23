// apps/backend/src/nats/nrequest.ts

import { NatsConnection } from '@nats-io/transport-node';

/**
 * Sends a request to a specific NATS subject and waits for a response.
 * 
 * @param nc - The NATS connection instance
 * @param subject - The NATS subject string (e.g., "timer.start")
 * @param payload - The data to send
 */
export async function nrequest<TReq, TRes>(
  nc: NatsConnection,
  subject: string,
  payload: TReq
): Promise<TRes> {
  if (!nc) {
    console.log("error in connection (undefined");
    return null as TRes;
  }

  const msg = await nc.request(subject, JSON.stringify(payload));
  return msg.data as TRes;
}

