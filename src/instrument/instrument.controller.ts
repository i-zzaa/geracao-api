import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('instrument')
@UseGuards(AuthGuard('jwt'))
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Get()
  getAll() {
    return this.instrumentService.getAll();
  }

  @Get(':search')
  search(@Param('word') word: string) {
    return this.instrumentService.search(word);
  }

  @Post()
  create(@Body() body: any) {
    return this.instrumentService.create(body);
  }
}
