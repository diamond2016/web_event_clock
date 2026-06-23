"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeService = void 0;
// src/services/time.service.ts
const time_publisher_service_js_1 = require("#/time-publisher/services/time-publisher-service.js");
class TimeService {
    static publisher = null;
    static async startPublisher(config = {}) {
        if (this.publisher) {
            console.warn('🕒 TimePublisher already started');
            return;
        }
        const natsUrl = config.natsUrl || 'nats://localhost:4222';
        try {
            this.publisher = new time_publisher_service_js_1.TimePublisherService({ natsUrl });
            await this.publisher.start();
            console.log('🕒 TimePublisher Service started with success');
        }
        catch (error) {
            console.error('❌ Failed to start TimePublisher Service:', error.message);
            this.publisher = null; // Ensure publisher is null if start fails
            throw error; // Re-throw to indicate failure to the caller
        }
    }
    static async shutdown() {
        if (this.publisher) {
            await this.publisher.shutdown();
            this.publisher = null;
            console.log('🕒 TimePublisher Service stopped');
        }
    }
    static isRunning() {
        return this.publisher !== null;
    }
}
exports.TimeService = TimeService;
