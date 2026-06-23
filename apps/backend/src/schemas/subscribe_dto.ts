// src/schemas/subscribe_params_dto.ts
import { z } from 'zod';
import { ChannelSchema } from './channel_dto.js'


export const SubscribeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});


