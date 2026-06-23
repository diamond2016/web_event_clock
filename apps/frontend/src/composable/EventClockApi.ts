import {
  NatsMessageHandler,
  ClockEvent,
  SetRequestPayload,
  SetResponsePayload,
  ClockChannel,
} from "@web-event-clock/shared";

import { wsService } from "../services/websocket";
import { DefaultApi } from "../api/client/index";

const api = new DefaultApi();

export class EventClockApi {
  constructor() {}

  async subscribeEvent(
    channel: ClockChannel,
    cb: NatsMessageHandler<ClockEvent>,
  ): Promise<void> {
    console.log(`[API_SUB] Subscribing to ${channel}`);
    return wsService.subscribe(channel, cb);
  }

  async unSubscribeEvent(
    channel: ClockChannel,
    cb: NatsMessageHandler<ClockEvent>,
  ): Promise<void> {
    console.log(`[API_SUB] Unsubscribing from ${channel}`);
    return wsService.unsubscribe(channel, cb);
  }

  async publishEvent(
    channel: ClockChannel,
    payload: SetRequestPayload,
  ): Promise<SetResponsePayload> {
    return (await api.apiPublishChannelPost(channel, payload)).data;
  }

  async setClockEvent(payload: SetRequestPayload): Promise<SetResponsePayload> {
    return (await api.apiSetClockPost(payload)).data;
  }

  async startTimerEvent(
    payload: SetRequestPayload,
  ): Promise<SetResponsePayload> {
    return (await api.apiStartTimerPost(payload)).data;
  }

  async stopTimerEvent(
    payload: SetRequestPayload,
  ): Promise<SetResponsePayload> {
    return (await api.apiStopTimerPost(payload)).data;
  }
}
