import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateCountDownEvent } from './countdown.event';
@WebSocketGateway({transports: [ 'websocket'], cors: ['*']})
export class CountDownGateway implements OnGatewayConnection, OnGatewayDisconnect{
  logger: Logger = new Logger(CountDownGateway.name);
  handleConnection(socket: Socket) {
    // handle incomming client
    const name = socket.client.request.headers['name'] as string;
    socket.join(name);
    this.logger.log(`user ${name} join room ${name}`);
  }
  handleDisconnect(socket: Socket) {
    const name = socket.client.request.headers['name'] as string;
    socket.leave(name);
    this.logger.log(`user ${name} leave room ${name}`);
  }
  // setup server socket
  @WebSocketServer() server: Server;
  @OnEvent('update.count.down', { async: true })
  @UsePipes(ValidationPipe)
  handleCountDown(payload: UpdateCountDownEvent) {
    this.logger.log('update event', payload);
    const user = payload.user;
    this.server.to(user).emit('count-down', payload);
  }
}