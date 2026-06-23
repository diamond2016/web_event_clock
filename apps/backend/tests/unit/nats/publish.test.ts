import { describe, it, expect, vi } from 'vitest';
import { publish } from '#/nats/publish.js';
import { NatsConnection } from '@nats-io/transport-node';

describe('NATS Helpers - Unit Tests', () => {
  it('publish should call nc.publish with stringified payload', async () => {
    // Mock NatsConnection
    const mockNc = {
      publish: vi.fn(),
    } as unknown as NatsConnection;

    const subject = 'test.subject';
    const payload = { message: 'hello' };

    await publish(mockNc, subject, payload);

    expect(mockNc.publish).toHaveBeenCalledWith(subject, JSON.stringify(payload));
  });
});
