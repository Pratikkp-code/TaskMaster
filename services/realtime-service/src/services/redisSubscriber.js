import { createClient } from 'redis';

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.on('error', (err) => console.error('Redis Subscriber Error', err));

// This function takes the WebSocket server instance (wss) as an argument
// so it has a list of all connected clients to send messages to.
export const subscribeToTaskUpdates = async (wss) => {
  await subscriber.connect();
  console.log('Realtime Service: Redis Subscriber Connected...');

  // Subscribe to the 'task-updates' channel.
  // This name MUST EXACTLY MATCH the one used in the task-service.
  await subscriber.subscribe('task-updates', (message) => {
    console.log(`Realtime-service received a message from Redis: ${message}`);
    
    // When a message arrives, loop through all connected clients and send it.
    wss.clients.forEach((client) => {
      // readyState === 1 means the connection is open
      if (client.readyState === 1) { 
        client.send(message);
      }
    });
  });
};