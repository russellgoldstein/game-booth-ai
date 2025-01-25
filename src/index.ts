import 'reflect-metadata';
import dotenv from 'dotenv';
import session from 'express-session';
import { Request, Response } from 'express';
import app from './app';

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});