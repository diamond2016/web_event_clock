// src/schemas/publish_dto.ts
import { z } from 'zod';

const MODE_OPTIONS = ['absolute', 'relative'];

export const ModeSchema = z.enum(MODE_OPTIONS);
const regexFormat = /\d{2}:\d{2}(:\d{2})?/;

export const SetRequestSchema = z.object({
  time: z.string().regex(regexFormat, "time must be 'hh:hmm' or 'hh:mm:ss'"),
  mode: ModeSchema,
});

export const SetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

