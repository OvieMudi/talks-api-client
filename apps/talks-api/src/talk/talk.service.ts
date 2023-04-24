import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTalkDto } from './dto/create-talk.dto';
import { TalkRepository } from './repository/talk.repository';
import { TalkAttendeeRepository } from './repository/talk-attendee.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class TalkService {
  constructor(
    private talkRepository: TalkRepository,
    private talkAttendeeRepository: TalkAttendeeRepository,
    private userRepository: UserRepository,
  ) {}

  create(createTalkDto: CreateTalkDto) {
    return this.talkRepository.create(createTalkDto);
  }

  async addAttendee(talkId: string, userId: string) {
    const talkQuery = await this.talkRepository.findOne({
      _id: talkId,
    });
    const userQuery = await this.userRepository.findOne({
      _id: userId,
    });

    const [talk, user] = await Promise.all([talkQuery, userQuery]);

    if (!talk) {
      throw new NotFoundException('Talk not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const talkAttendee = await this.talkAttendeeRepository.findOneByIds(
      talkId,
      userId,
    );

    if (talkAttendee) {
      throw new ConflictException('User is already an attendee');
    }

    return this.talkAttendeeRepository.create(talkId, userId);
  }

  findAll() {
    return this.talkRepository.find();
  }

  async findOne(id: string) {
    const talk = await this.talkRepository.findOne({ _id: id });

    if (!talk) throw new NotFoundException('Talk not found');

    return talk;
  }

  async findAttendees(id: string): Promise<User[]> {
    const talkAttendees =
      await this.talkAttendeeRepository.findAndPopulateAttendees({ talk: id });

    return talkAttendees.map((talkattendee) => talkattendee.user);
  }
}
