import { IsString } from 'class-validator';

export class CreateTalkAttendeeDto {
  @IsString()
  userId: string;
}
