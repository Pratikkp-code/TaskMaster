import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { subscribeToTaskUpdates } from './services/redisSubscriber.js';

const app = express();
const port = process.env.PORT || 4003;

app.use(cors({
  origin: '*', 
  credentials: true,
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Access-Control-Allow-Private-Network'],
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    next();
});

// create an HTTP server to which we can attach our WebSocket server
const server = http.createServer(app);

// create the WebSocket server and attach it
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('A new client connected to the WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});


subscribeToTaskUpdates(wss);


app.get('/', (req, res) => {
  res.json({ message: "Real-time Service is running." });
});

// Start the HTTP server (which  starts the WebSocket server)
server.listen(port, () => {
  console.log(`Real-time Service (with WebSocket) is running on port ${port}`);
});