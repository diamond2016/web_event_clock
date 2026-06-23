// src/schemas/channel_dto.ts
import { z } from 'zod';

export const ChannelSchema = z.object({
  channel: z.string()
});
