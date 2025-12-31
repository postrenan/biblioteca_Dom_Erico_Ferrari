import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  create(@Body() body: { title: string; author?: string; reason?: string; userId: string }) {
    // In a real app we'd get userId from the request (JWT)
    // For now keeping it simple as the frontend might pass it or we might need to add AuthGuard
    return this.suggestionsService.create(body.userId, {
      title: body.title,
      author: body.author,
      reason: body.reason,
    });
  }

  @Get()
  findAll() {
    return this.suggestionsService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  findMy(@Request() req) {
    return this.suggestionsService.findByUser(req.user.sub);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.suggestionsService.updateStatus(id, body.status);
  }
}
