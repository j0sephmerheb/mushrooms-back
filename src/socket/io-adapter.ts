import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  private readonly options: Partial<ServerOptions>;

  constructor(app: INestApplication) {
    super(app);
    this.options = {
      cors: {
        origin: 'https://mushrooms.josephmerheb.net',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Enable if you need to send cookies or authentication headers
      },
    };
  }

  createIOServer(port: number, options?: Partial<ServerOptions>): any {
    const mergedOptions = { ...this.options, ...options };
    return super.createIOServer(port, mergedOptions);
  }
}
