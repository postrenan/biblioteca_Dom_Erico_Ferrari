import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RequiredReadingsService } from './required-readings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('required-readings')
export class RequiredReadingsController {
  constructor(private readonly requiredReadingsService: RequiredReadingsService) {}

  @Post()
  create(@Body() body: { serieId: string; bookId: string }) {
    return this.requiredReadingsService.create(body.serieId, body.bookId);
  }

  @Get()
  findAll() {
    return this.requiredReadingsService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  findMy(@Request() req) {
    return this.requiredReadingsService.findByUser(req.user.id);
  }

  @Get('serie/:serieId')
  findBySerie(@Param('serieId') serieId: string) {
      return this.requiredReadingsService.findBySerie(serieId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.requiredReadingsService.delete(id);
  }
}
