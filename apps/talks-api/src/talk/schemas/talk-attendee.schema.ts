import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { toJsonOptions } from 'src/common/schema-options/to-json';
import { User } from 'src/user/schemas/user.schema';
import { Talk } from './talk.schema';

type TalkAttendeeDocument = HydratedDocument<TalkAttendee>;

@Schema()
class TalkAttendee {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Talk', required: true })
  talk: Talk;
}

const TalkAttendeeSchema = SchemaFactory.createForClass(TalkAttendee);

TalkAttendeeSchema.set('toJSON', toJsonOptions);
TalkAttendeeSchema.set('toObject', toJsonOptions);

export { TalkAttendee, TalkAttendeeDocument, TalkAttendeeSchema };
