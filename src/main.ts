import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const port = process.env.HTTP_PORT || 8080;
const host = process.env.HTTP_HOST;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'dist/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'dist/views'));
  app.setViewEngine('hbs');
  await app.listen(port);
  Logger.log(`Server running on ${host}:${port}`);
}
bootstrap();
