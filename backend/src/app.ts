import express from 'express';
import { catalogueRouter } from './routes/catalogue.ts';
import { enquiriesRouter } from './routes/enquiries.ts';

export const app = express();

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
});

app.use('/api/catalogue', catalogueRouter);

app.use('/api/enquiries', enquiriesRouter);
