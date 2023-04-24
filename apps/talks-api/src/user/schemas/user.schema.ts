import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { toJsonOptions } from 'src/common/schema-options/to-json';
import { Talk } from 'src/talk/schemas/talk.schema';

type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ unique: true, required: true })
  email: string;

  talks: Talk[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('talks', {
  ref: 'TalkAttendee',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.set('toJSON', toJsonOptions);
UserSchema.set('toObject', toJsonOptions);

export { User, UserDocument, UserSchema };
