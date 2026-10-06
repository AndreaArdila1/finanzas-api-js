import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Finanzas API')
    .setDescription('API para la gestión de finanzas personales')
    .setVersion('1.0').build();

  const document = SwaggerModule.createDocument(
    app as Parameters<typeof SwaggerModule.createDocument>[0],
    config,
  );
  SwaggerModule.setup('docs', app as Parameters<typeof SwaggerModule.setup>[1], document);
  
  await app.listen(3000);
}
void bootstrap();