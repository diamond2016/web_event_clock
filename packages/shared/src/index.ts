// =============================================
// Types shared between Frontend and Backend
// =============================================
import { Subscription } from '@nats-io/transport-node';

// Define a type for the handler function to ensure type safety
// T is the expected type of the parsed JSON payload
export type NatsMessageHandler<T> = (payload: T) => void;

export interface ActiveSubscription {
  subject: string;
  subscription: Subscription;
  handlerId?: string;
}

export interface ResponsePayload {
  success: boolean;
  message?: string;
}

export interface SetRequestPayload {
  time: string;
  mode?: 'absolute' | 'relative';
}

export interface SetResponsePayload {
  success: boolean | undefined;
  message?: string;
  currentTime?: string;
}

export interface ClockEvent {
  channel: 'hhmm' | 'hhmmss';
  time: string;
}

export type ClockChannel = 'hhmm' | 'hhmmss';