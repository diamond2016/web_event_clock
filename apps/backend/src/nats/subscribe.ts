// apps/backend/src/nats/subscribe.ts
import { FastifyInstance } from 'fastify';
import { NatsConnection, Subscription, Msg } from '@nats-io/transport-node';

import { NatsMessageHandler } from '@web-event-clock/shared';
import { subscriptionManager } from './SubscriptionManager.js';

/**
 * Subscribes to a NATS subject and processes incoming messages using a provided handler.
 * @param nc The NATS connection object.
 * @param Subject The NATS subject to subscribe to.
 * @param handler The function to call when a message is received. It receives the parsed JSON payload.
 * @param handlerId Optional ID for the handler, useful for managing subscriptions if needed.
 * @returns A Promise that resolves when the subscription is established.
 */

export async function subscribe<T>(
  nc: NatsConnection,
  Subject: string,
  handler: NatsMessageHandler<T>,
  handlerId?: string
): Promise<void> {
  let sub: Subscription | null = null;
  try {
    // Directly provide the callback to nc.subscribe
    sub = nc.subscribe(Subject, {
      callback: (err: Error | null, msg: Msg) => { // Use the original signature, but handle async internally
        if (err) {
          console.error(`Error receiving message on ${Subject}:`, err);
          return; // Explicitly return void
        }

        // Process message and call handler asynchronously
        // We don't await this here, as the NATS client callback is typically not expected to be awaited.
        // If the handler itself needs to perform async operations, it should handle them internally.
        (async () => {
          try {
            const data: T = (() => {
              if (typeof (msg as any).json === 'function') {
                return (msg as any).json() as T;
              }

              const rawData = msg.data;
              if (typeof rawData === 'string') {
                return JSON.parse(rawData) as T;
              }

              if (rawData instanceof Uint8Array) {
                return JSON.parse(new TextDecoder().decode(rawData)) as T;
              }

              if (rawData && typeof rawData === 'object') {
                return rawData as T;
              }

              return JSON.parse(String(rawData)) as T;
            })();

            // Execute the provided handler
            handler(data);
          } catch (e) {
            console.error(`Error processing message on ${Subject}:`, e);
            // Consider adding more robust error handling, e.g., NACK if applicable
          }
        })(); // Immediately invoke the async IIFE
      }
    });

    subscriptionManager.subscribe(nc, Subject, sub, handlerId); 
    console.log(`Subscribed to ${Subject} with handler ${handlerId || 'anonymous'}.`);

  } catch (error) {
    console.error(`Failed to subscribe to ${Subject}:`, error);
    if (sub) {
      try {
        await sub.unsubscribe();
      } catch (e) {
        console.error(`Error during cleanup unsubscribe for ${Subject}:`, e);
      }
    }
    throw error;
  }
}
