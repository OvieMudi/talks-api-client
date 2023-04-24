import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Talk } from '../schemas/talk.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateTalkDto } from '../dto/create-talk.dto';
import { TalkAttendeeRepository } from './talk-attendee.repository';

@Injectable()
export class TalkRepository {
  constructor(
    @InjectModel(Talk.name) private talkModel: Model<Talk>,
    private talkAttendeeRepository: TalkAttendeeRepository,
  ) {}

  async create(createTalkDto: CreateTalkDto): Promise<Talk> {
    const newTalk = new this.talkModel(createTalkDto);
    return newTalk.save();
  }

  findOneById(id: string) {
    return this.talkModel.findById(id);
  }

  async findOneAndPopulateAttendees(id: string): Promise<Talk> {
    const talkWithAttendees = await this.talkModel
      .findOne({ _id: id })
      .populate({
        path: 'attendees',
        select: 'user talk',
        populate: { path: 'user' },
      });

    talkWithAttendees.attendees = talkWithAttendees.attendees.map(
      (attendee: any) => attendee.user,
    );

    return talkWithAttendees;
  }
  async findOne(talkFilterQuery: FilterQuery<Talk>): Promise<Talk> {
    return this.talkModel.findOne(talkFilterQuery);
  }

  async find(talkFilterQuery?: FilterQuery<Talk>): Promise<Talk[]> {
    return this.talkModel.find(talkFilterQuery);
  }
}
