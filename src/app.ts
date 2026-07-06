import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'gearup-api' });
});

export default app;
