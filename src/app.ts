import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import routes from './routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(json({ limit: '10kb' }));

// Mount all routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

export default app;
