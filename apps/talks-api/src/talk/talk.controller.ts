import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TalkService } from './talk.service';
import { CreateTalkDto } from './dto/create-talk.dto';
import { CreateTalkAttendeeDto } from './dto/create-talk-attendee.dto';

@Controller({ path: 'talks', version: '1' })
export class TalkController {
  constructor(private readonly talkService: TalkService) {}

  @Post()
  create(@Body() createTalkDto: CreateTalkDto) {
    return this.talkService.create(createTalkDto);
  }

  @Post(':id/attendees')
  addAttendee(
    @Param('id') id: string,
    @Body() createTalkAttendeeDto: CreateTalkAttendeeDto,
  ) {
    return this.talkService.addAttendee(id, createTalkAttendeeDto.userId);
  }

  @Get(':id/attendees')
  findAttendees(@Param('id') id: string) {
    return this.talkService.findAttendees(id);
  }

  @Get()
  findAll() {
    return this.talkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talkService.findOne(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.talkService.remove(id);
  // }
}
