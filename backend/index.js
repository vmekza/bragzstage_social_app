import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }

  //Middleware
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(morgan('common'));

  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);

  app.listen(8800, () => {
    console.log('Server is listening on port 8800');
  });
}

// Start the server
main();
