import express from 'express';
import helmet from 'helmet';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import chatRoutes from './chat.routes';
import statsRoutes from './stats.routes';

const router = express.Router();

// Add helmet middleware
router.use(helmet());

// Add rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
});
router.use(limiter);

// Limit request size
router.use(json({ limit: '10kb' }));

// Mount route modules
router.use('/api/chat', chatRoutes);
router.use('/stats', statsRoutes);

export default router;
