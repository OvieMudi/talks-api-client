import { Module, forwardRef } from '@nestjs/common';
import { TalkService } from './talk.service';
import { TalkController } from './talk.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Talk, TalkSchema } from './schemas/talk.schema';
import {
  TalkAttendee,
  TalkAttendeeSchema,
} from './schemas/talk-attendee.schema';
import { TalkRepository } from './repository/talk.repository';
import { TalkAttendeeRepository } from './repository/talk-attendee.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: Talk.name, schema: TalkSchema },
      { name: TalkAttendee.name, schema: TalkAttendeeSchema },
    ]),
  ],
  controllers: [TalkController],
  providers: [TalkService, TalkRepository, TalkAttendeeRepository],
  exports: [TalkAttendeeRepository],
})
export class TalkModule {}
