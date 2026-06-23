// /apps/backend/src/main.ts entry point for backend app

import Fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import dotenv from "dotenv";
import { TimeServiceClient } from "./nats/time-service-client.js"; // Import TimeServiceClient

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development'

const fastify = Fastify({
  logger: isDevelopment 
    ? {
        transport: {
          target: 'pino-pretty',
          options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' }
        }
      }
    : true // In produzione usa il formato JSON nativo e velocissimo
})

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// plugin registration
const pluginsModule = await import("./plugins/index.js");
await fastify.register(pluginsModule.default);

// routes
const healthRoute = await import("./routes/api/health.js");
await fastify.register(healthRoute.default, { prefix: "/api" });
const subscribeRoute = await import("./routes/api/subscribe.js");
await fastify.register(subscribeRoute.default, { prefix: "/api" });
const unsubscribeRoute = await import("./routes/api/unsubscribe.js");
await fastify.register(unsubscribeRoute.default, {
  prefix: "/api",
});
const publishRoute = await import("./routes/api/publish.js");
await fastify.register(publishRoute.default, { prefix: "/api" });
const setClockRoute = await import("./routes/api/set-clock.js");
await fastify.register(setClockRoute.default, { prefix: "/api" });
const timerRoute = await import("./routes/api/timer.js");
await fastify.register(timerRoute.default, { prefix: "/api" });

// --- NATS Subscription Setup ---
// This part needs to run AFTER plugins are registered,
// ensuring fastify.nc and fastify.io are available.
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`🚀 Server running on http://localhost:${port}`);
    fastify.log.info(`📡 Health check → http://localhost:${port}/api/health`);

    // Ensure NATS connection and Socket.IO server are ready before subscribing
    if (!fastify.nc) {
      fastify.log.error(
        "NATS connection (fastify.nc) is not available. Cannot set up subscriptions.",
      );
      // Depending on your app's criticality, you might want to exit or handle this differently.
      // For now, we'll log and proceed, but subscriptions won't work.
    } else {
      fastify.log.info(
        "NATS connection available. Setting up time service subscriptions...",
      );
      try {
        await TimeServiceClient.subscribeHHMM(fastify);
        fastify.log.info("HHMM NATS subscription handler registered.");

        await TimeServiceClient.subscribeHHMMSS(fastify);
        fastify.log.info("HHMMSS NATS subscription handler registered.");
      } catch (error) {
        fastify.log.error(
          { error },
          "Failed to register NATS subscription handlers.",
        );
      }
    }

    if (!fastify.io) {
      fastify.log.error(
        "Socket.IO server (fastify.io) is not available. WebSocket emissions will fail.",
      );
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
