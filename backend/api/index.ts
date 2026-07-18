import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';
const server = express();

async function bootstrap() {

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.useGlobalPipes( new ValidationPipe({ whitelist: true, }), );
  app.use(cookieParser());
  app.enableCors({ origin: process.env.URL_FRONT, credentials: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', allowedHeaders: 'Content-Type, Accept, Authorization', optionsSuccessStatus: 204});
  await app.init();

  return server;
}

export default bootstrap();
