// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomIoAdapter } from './socket/io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allow all origins temporarily
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
  });

  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3000);
}
bootstrap();
