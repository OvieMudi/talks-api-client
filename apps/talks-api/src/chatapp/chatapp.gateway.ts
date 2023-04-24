import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Talk } from 'src/talk/schemas/talk.schema';

@WebSocketGateway({
  namespace: 'sockets/chat',
  cors: { origin: '*' },
})
export class ChatappGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private wss: Server;

  private logger = new Logger('ChatappGateway');

  afterInit() {
    this.logger.debug('=== Gateway initialized ===');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`=== Client connected: ${client.id} ===`);
  }

  @SubscribeMessage('serverMessage')
  handleMessage(
    client: Socket,
    message: {
      username: string;
      content: string;
      id: string;
      roomId: string;
    },
  ): void {
    this.logger.debug('message:', message);
    this.wss.to(message.roomId).emit('clientMessage', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: Talk): void {
    this.logger.debug('ChatappGateway => data:', data);
    client.join(data.id);
    client.broadcast.to(data.id).emit('joinedRoom', data);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: { name: string; id: string }): void {
    client.leave(room.name);
    client.emit('leftRoom', room);
  }
}
