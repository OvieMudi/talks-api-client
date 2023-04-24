import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TalkModule } from './talk/talk.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule, TalkModule, DatabaseModule, ConfigModule.forRoot()],
})
export class AppModule {}
