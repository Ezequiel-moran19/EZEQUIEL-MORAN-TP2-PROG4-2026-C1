import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create( AppModule, new ExpressAdapter(server) );

  app.use(cookieParser());

  app.enableCors({ origin: ['https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app'], credentials: true });
https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app
  app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.init();

  return server;
}

export default bootstrap();