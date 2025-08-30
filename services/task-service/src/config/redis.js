import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log('Task Service: Redis Connected...');
};


export { redisClient, connectRedis };
