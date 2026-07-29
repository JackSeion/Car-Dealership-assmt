import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { config } from './config';
import { notFound, errorHandler } from './middleware';

dotenv.config();

const app = express();
app.use(express.json());

// Mount API routes (no endpoints implemented yet)
app.use('/api', routes);

// Minimal middleware pipeline for 404s and errors (no business logic)
app.use(notFound);
app.use(errorHandler);

export default app;
