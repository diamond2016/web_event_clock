// src/nats/publish.ts
import { NatsConnection } from  '@nats-io/transport-node';

export async function publish<T>(
  nc: NatsConnection,
  subject: string,
  payload: T
): Promise<void> {
  nc.publish(subject, JSON.stringify(payload));
}
