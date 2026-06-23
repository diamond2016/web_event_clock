import { NatsConnection, Subscription } from '@nats-io/transport-node';
import { ActiveSubscription } from '@web-event-clock/shared';

class SubscriptionManager {
  private activeSubscriptions = new Map<string, ActiveSubscription>(); // Key: Subject

  subscribe(
    nc: NatsConnection, 
    subject: string, 
    sub: Subscription, 
    handlerId?: string
  ) {
    if (this.activeSubscriptions.has(subject)) {
      console.warn(`Replacing existing subscription for ${subject}`);
      const existingSub = this.activeSubscriptions.get(subject);
      existingSub?.subscription.unsubscribe();
    }
    this.activeSubscriptions.set(subject, { subject, subscription: sub, handlerId });
  }

  unsubscribe(subject: string) {
    const subInfo = this.activeSubscriptions.get(subject);
    if (subInfo) {
      subInfo.subscription.unsubscribe();
      this.activeSubscriptions.delete(subject);
      console.log(`Unsubscribed and removed from manager: ${subject}`);
    }
  }

  async closeAll() {
    for (const subInfo of this.activeSubscriptions.values()) {
      try {
        await subInfo.subscription.unsubscribe();
      } catch (e) {
        console.error(`Error unsubscribing ${subInfo.subject}:`, e);
      }
    }
    this.activeSubscriptions.clear();
    console.log('All NATS subscriptions closed.');
  }
}

export const subscriptionManager = new SubscriptionManager();