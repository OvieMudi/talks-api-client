import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { toJsonOptions } from 'src/common/schema-options/to-json';
import { User } from 'src/user/schemas/user.schema';

type TalkDocument = HydratedDocument<Talk>;

@Schema({ timestamps: true })
class Talk {
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  details: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  speakers: User[];

  @Prop({ default: 'Virtual' })
  location: string;

  @Prop({ default: null })
  date: Date;

  attendees: User[];
}

const TalkSchema = SchemaFactory.createForClass(Talk);

TalkSchema.virtual('attendees', {
  ref: 'TalkAttendee',
  localField: '_id',
  foreignField: 'talk',
});

TalkSchema.set('toJSON', toJsonOptions);
TalkSchema.set('toObject', toJsonOptions);

export { Talk, TalkDocument, TalkSchema };
