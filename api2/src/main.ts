import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { AppModule } from './app.module';

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  Logger.log(`${req.method} ${req.originalUrl}`, 'HTTP');
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Showcase API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(httpLogger);

  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
}
bootstrap();
