import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  // Check if the request is a POST request and if the body is empty
  if (req.method === 'POST' && Object.keys(req.body).length === 0) {
    // Also check if the content-type is not set to application/json
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      return res.status(400).json({ 
        msg: "Request body is empty. Make sure you are sending a JSON body and the 'Content-Type' header is set to 'application/json'." 
      });
    }
  }
  next();
});

// Define Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Auth Service API!" });
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});