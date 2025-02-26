import dotenv from 'dotenv';
import cors from 'cors';
import { resolve } from 'path';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';

import { readFile } from 'fs/promises';
import https from 'https';

dotenv.config({ path: resolve(__dirname, '../../.env') });

import { createClientAndConnect } from './db';
import { mainRouter } from './routes/main';

const app = express();

const corsOptions = {
  origin: [
    `http://localhost:${process.env.CLIENT_PORT}`,
    `https://localhost:${process.env.CLIENT_PORT}`,
    `http://agario-dominators-44.ya-praktikum.tech:${process.env.CLIENT_PORT}`,
    `https://agario-dominators-44.ya-praktikum.tech:${process.env.CLIENT_PORT}`,
    `http://agario-dominators-44.ya-praktikum.tech`,
    `https://agario-dominators-44.ya-praktikum.tech`,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(json(), cookieParser(), cors(corsOptions));

const port = Number(process.env.SERVER_PORT) || 3001;

createClientAndConnect();

// Функция для загрузки сертификатов
const getSSLOptions = async () => {
  return {
    key: await readFile('cert.key'), // Приватный ключ
    cert: await readFile('cert.pem'), // Сертификат
  };
};

// Запускаем сервер с HTTPS
const startServer = async () => {
  const options = await getSSLOptions();

  https.createServer(options, app).listen(port, () => {
    console.log(`  ➜ 🔒 HTTPS Server is running on https://localhost:${port}`);
  });
};

startServer();

app.use(mainRouter);
