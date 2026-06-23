// src/nats/response.ts

import { NatsConnection } from  '@nats-io/transport-node';
import { subscriptionManager } from './SubscriptionManager.js'


export async function respond<TReq, TRes>(
  nc: NatsConnection,
  subject: string,
  handler: (payload: TReq) => Promise<TRes> | TRes,
): Promise<void> {
  const sub = nc.subscribe(subject);

  (async () => {
    for await (const msg of sub) {
      const req = JSON.parse(msg.json()) as TReq;
      const res = await handler(req);
      msg.respond(JSON.stringify(res));
    }
  })();
}
