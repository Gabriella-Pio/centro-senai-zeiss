import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const origins = process.env.FRONTEND_URL?.split(',').map((origin) => origin.trim());
  app.enableCors({
    origin: origins?.length ? origins : true,
    methods: ['GET', 'POST', 'PATCH'],
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SENAI Metrology Platform API')
    .setDescription('API pública e administrativa da plataforma de metrologia SENAI × ZEISS.')
    .setVersion('1.0')
    .addServer('/api/v1', 'API versionada')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  });

  await app.listen(Number(process.env.PORT ?? 3333), '0.0.0.0');
}

void bootstrap();
