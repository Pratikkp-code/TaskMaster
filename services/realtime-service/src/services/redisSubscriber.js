import { createClient } from 'redis';

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.on('error', (err) => console.error('Redis Subscriber Error', err));


export const subscribeToTaskUpdates = async (wss) => {
  await subscriber.connect();
  console.log('Realtime Service: Redis Subscriber Connected...');


  await subscriber.subscribe('task-updates', (message) => {
    console.log(`Realtime-service received a message from Redis: ${message}`);
    

    wss.clients.forEach((client) => {

      if (client.readyState === 1) { 
        client.send(message);
      }
    });
  });
};