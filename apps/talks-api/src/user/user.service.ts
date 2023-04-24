import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import { TalkAttendeeRepository } from 'src/talk/repository/talk-attendee.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private talkAttendeeRepository: TalkAttendeeRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.userRepository.create(createUserDto);
  }

  async findAll(query: { email?: string }) {
    const filter = query.email ? query : null;
    return this.userRepository.find(filter);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findTalks(id: string) {
    const userTalks = await this.talkAttendeeRepository.findAndPopulateTalks({
      user: id,
    });

    return userTalks.map((talkattendee) => talkattendee.talk);
  }
}
