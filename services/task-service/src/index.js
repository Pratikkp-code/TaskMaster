import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import taskRoutes from './routes/task.routes.js';

// Connect to Databases
connectDB();
connectRedis();

const app = express();
const port = process.env.PORT || 4002;

// Middleware
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

app.use(express.json());

// Define Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Task Service API!" });
});

app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Task Service running on port ${port}`);
});

