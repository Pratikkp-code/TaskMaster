import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';


connectDB();

const app = express();
const port = process.env.PORT || 4001;

// Middleware

app.use(express.json());
app.use(cors({
  origin: '*', 
  credentials: true, 
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Access-Control-Allow-Private-Network'],
}));

app.use((req, res, next) => {
  
  if (req.method === 'POST' && Object.keys(req.body).length === 0) {

    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      return res.status(400).json({ 
        msg: "Request body is empty. Make sure you are sending a JSON body and the 'Content-Type' header is set to 'application/json'." 
      });
    }
  }
  next();
});


app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Auth Service API!" });
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});