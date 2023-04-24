import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TalkAttendee } from '../schemas/talk-attendee.schema';

@Injectable()
export class TalkAttendeeRepository {
  constructor(
    @InjectModel(TalkAttendee.name)
    private talkAttendeesModel: Model<TalkAttendee>,
  ) {}

  async create(talkId: string, userId: string): Promise<TalkAttendee> {
    const newTalkAttendee = new this.talkAttendeesModel({
      talk: talkId,
      user: userId,
    });
    return newTalkAttendee.save();
  }

  async findOneByIds(talkId: string, userId: string): Promise<TalkAttendee> {
    return this.talkAttendeesModel.findOne({ talk: talkId, user: userId });
  }

  async find(
    talkAttendeeFilterQuery: FilterQuery<TalkAttendee>,
  ): Promise<TalkAttendee[]> {
    return this.talkAttendeesModel.find(talkAttendeeFilterQuery);
  }

  async findAndPopulateAttendees(
    talkAttendeeFilterQuery: FilterQuery<TalkAttendee>,
  ): Promise<TalkAttendee[]> {
    return this.talkAttendeesModel
      .find(talkAttendeeFilterQuery)
      .populate({ path: 'user' });
  }

  async findAndPopulateTalks(
    talkAttendeeFilterQuery: FilterQuery<TalkAttendee>,
  ): Promise<TalkAttendee[]> {
    return this.talkAttendeesModel
      .find(talkAttendeeFilterQuery)
      .populate({ path: 'talk' });
  }
}
