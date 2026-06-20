import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.useGlobalPipes( new ValidationPipe({ whitelist: true, }), );

  app.enableCors({origin: ['https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app'], credentials: true});

  await app.init();

  return server;
}

export default bootstrap();
