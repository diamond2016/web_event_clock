import { NatsConnection } from  '@nats-io/transport-node';
import { subscriptionManager } from './SubscriptionManager.js';

export async function unsubscribe<T>(
  nc: NatsConnection,
  Subject: string,
): Promise<void> {

  // Unregister with manager, manages sends nats unsubscribe message and cleaups
  subscriptionManager.unsubscribe(Subject);
}
