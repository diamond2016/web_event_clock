import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function setupSocket(fastify: FastifyInstance) {
  // Initialize the Socket.io server
  const io = new Server(fastify.server, {
    cors: {
      origin: "*", // In production, replace with your actual frontend URL
      methods: ["GET", "POST"]
    },
  });

  // Decorate the fastify instance so we can access it via fastify.io
  fastify.decorate('io', io);

  // Optional: Handle connection/disconnection logs
  io.on('connection', (socket) => {
    fastify.log.info(`Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      fastify.log.info(`Client disconnected: ${socket.id}`);
    });
  });
}

export default fp(setupSocket, { name: 'socket' });

