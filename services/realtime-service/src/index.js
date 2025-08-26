import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { subscribeToTaskUpdates } from './services/redisSubscriber.js';

const app = express();
const port = process.env.PORT || 4003;

app.use(cors());

// We create an HTTP server to which we can attach our WebSocket server
const server = http.createServer(app);

// Create the WebSocket server and attach it
const wss = new WebSocketServer({ server });

// This code runs every time a new client connects
wss.on('connection', (ws) => {
  console.log('A new client connected to the WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Start listening for messages from Redis and pass it our WebSocket server instance
subscribeToTaskUpdates(wss);

// A simple health-check route for the HTTP server
app.get('/', (req, res) => {
  res.json({ message: "Real-time Service is running." });
});

// Start the HTTP server (which also starts the WebSocket server)
server.listen(port, () => {
  console.log(`Real-time Service (with WebSocket) is running on port ${port}`);
});