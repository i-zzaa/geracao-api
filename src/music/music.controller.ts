import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('music')
@UseGuards(AuthGuard('jwt'))
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  getAll() {
    return this.musicService.getAll();
  }

  @Get('filter')
  get(@Body() body: any) {
    return this.musicService.get(body);
  }

  @Get(':search')
  search(@Param('notes') notes: string[], @Req() req: any) {
    return this.musicService.search(notes);
  }

  @Post()
  create(@Body() body: any) {
    return this.musicService.create(body);
  }
}
