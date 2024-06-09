// socket.gateway.ts
import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = [];
  private userCounter = 0;

  /**
   * handleConnection
   */
  handleConnection(client: Socket) {
    const user = {
      id: client.id,
      username: `User-${++this.userCounter}`,
      position: this.getRandomPosition(),
    };
    this.users.push(user);

    console.log('Client connected:', client.id, 'as', user.username);

    this.broadcastUsers();
    this.server.emit('userConnected', { message: 'New client connected', clientId: client.id, user });

    // Listen for 'sendMessage' event
    client.on('sendMessage', (data: { message: string }) => {
      this.handleReceivedMessage(client, data);
    });
  }

  /**
   * handleDisconnect
   */
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.users = this.users.filter(u => u.id !== client.id);
    this.broadcastUsers();
    this.server.emit('userDisconnected', { message: 'Client disconnected', clientId: client.id });
  }

  /**
   * getRandomPosition
   */
  private getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (800 - 50 + 1) + 50),
      y: Math.floor(Math.random() * (600 - 50 + 1) + 50),
      z: Math.floor(Math.random() * (600 - 50 + 1) + 50),
    };
  }

  /**
   * broadcastUsers
   */
  private broadcastUsers() {
    this.server.emit('users', this.users.map(user => ({
      username: user.username,
      position: user.position,
    })));
  }

  /**
   * handleReceivedMessage
   */
  private handleReceivedMessage(client: Socket, data: { message: string }) {
    const sender = this.users.find(user => user.id === client.id);

    console.log('Received message from client:', data.message);
    console.log('senderId:', sender.id);
    console.log('User:', sender.name);

    // Find the user who sent the message

    if (sender) {
      // Broadcast the message along with the sender's id
      this.server.emit('message', { message: data.message, senderId: sender.id, username: sender.username });
    } else {
      console.error('Sender not found');
    }
  }

}
