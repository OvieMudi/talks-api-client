import { Module } from '@nestjs/common';
import { ChatappGateway } from './chatapp.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatappGateway],
})
export class ChatappModule {}
