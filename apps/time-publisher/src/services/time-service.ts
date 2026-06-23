// src/services/time.service.ts
import { TimePublisherService } from './time-publisher-service';

export class TimeService {
  private static publisher: TimePublisherService | null = null;

  static async startPublisher(config: { natsUrl?: string } = {}): Promise<void> {
    if (this.publisher) {
      console.warn('🕒 TimePublisher already started');
      return;
    }

    // Use the environment variable, providing a fallback for local development
    const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
    try {
      this.publisher = new TimePublisherService({ natsUrl });
      await this.publisher.start();
      console.log('🕒 TimePublisher Service started with success');
    } catch (error: any) {
      console.error('❌ Failed to start TimePublisher Service:', error.message);
      this.publisher = null; // Ensure publisher is null if start fails
      throw error; // Re-throw to indicate failure to the caller
    }
  }

  static async shutdown(): Promise<void> {
    if (this.publisher) {
      await this.publisher.shutdown();
      this.publisher = null;
      console.log('🕒 TimePublisher Service stopped');
    }
  }

  static isRunning(): boolean {
    return this.publisher !== null;
  }
}