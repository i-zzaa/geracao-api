import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocationService } from './location.service';

@Controller('location')
@UseGuards(AuthGuard('jwt'))
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getAll() {
    return this.locationService.getAll();
  }

  @Get(':search')
  search(@Param('word') word: string) {
    return this.locationService.search(word);
  }

  @Post()
  create(@Body() body: any) {
    return this.locationService.create(body);
  }
}
