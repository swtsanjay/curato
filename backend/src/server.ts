import { app } from './app.ts';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3001);

app.listen(port, host, () => {
    console.log(`Curato API listening at http://${host}:${port}`);
});
