import 'reflect-metadata';
import dotenv from 'dotenv';
import session from 'express-session';
import { Request, Response } from 'express';
import app from './app';
import { createConnection, getConnectionManager } from 'typeorm';
import { ServiceContainer } from './services';
const config = require('../ormconfig');

dotenv.config();

const port = process.env.PORT || 3030;

// Session middleware
app.use(
  session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
  })
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await createConnection(config);
      console.log('Database connection established successfully.');

      // Initialize the service container
      ServiceContainer.initialize(connection);

      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });

      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};

// Start the application with connection retry
connectWithRetry();

// Handle process termination
process.on('SIGINT', async () => {
  try {
    const connectionManager = getConnectionManager();
    if (connectionManager.has('default')) {
      const connection = connectionManager.get('default');
      if (connection.isConnected) {
        await connection.close();
        console.log('Database connection closed.');
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
