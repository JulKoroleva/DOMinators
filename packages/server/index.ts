import dotenv from 'dotenv';
import cors from 'cors';
import { resolve } from 'path';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';

dotenv.config({ path: resolve(__dirname, '../../.env') });

import { createClientAndConnect } from './db';
import { mainRouter } from './routes/main';

const app = express();

const corsOptions = {
  origin: [
    `http://localhost:${process.env.CLIENT_PORT}`,
    `http://51.250.28.166:${process.env.CLIENT_PORT}`,
    `https://51.250.28.166:${process.env.CLIENT_PORT}`,
  ],
  credentials: true,
};

app.use(json(), cookieParser(), cors(corsOptions));

const port = Number(process.env.SERVER_PORT) || 3001;

createClientAndConnect();

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});

app.use(mainRouter);
