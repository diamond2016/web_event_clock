// src/schemas/status_dto.ts
import { z } from 'zod';

const STATUS_OPTIONS = ['OK', 'KO'];

export const StatusSchema = z.enum(STATUS_OPTIONS);

export type StatusType = z.infer<typeof StatusSchema>;
