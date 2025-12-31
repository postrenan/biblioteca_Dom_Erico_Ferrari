import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post('join')
  @UseGuards(AuthGuard('jwt'))
  join(@Body() body: { bookId: string }, @Request() req) {
    return this.waitingListService.joinQueue(req.user.id, body.bookId);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyQueue(@Request() req) {
    return this.waitingListService.getUserQueue(req.user.id);
  }
  
  @Get('check/:bookId')
  @UseGuards(AuthGuard('jwt'))
  checkStatus(@Param('bookId') bookId: string, @Request() req) {
      return this.waitingListService.checkUserStatus(req.user.id, bookId);
  }

  @Get('book/:bookId')
  @UseGuards(AuthGuard('jwt')) // Admin/Librarian ideally
  getBookQueue(@Param('bookId') bookId: string) {
    return this.waitingListService.getQueueByBook(bookId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  leave(@Param('id') id: string) {
    // Ideally verify if user owns the item or is admin
    return this.waitingListService.leaveQueue(id);
  }
}
