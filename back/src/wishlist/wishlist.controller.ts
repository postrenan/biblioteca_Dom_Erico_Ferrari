import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  add(@Body() body: { userId: string; bookId: string }) {
    return this.wishlistService.add(body.userId, body.bookId);
  }

  @Delete(':userId/:bookId')
  remove(@Param('userId') userId: string, @Param('bookId') bookId: string) {
    return this.wishlistService.remove(userId, bookId);
  }

  @Get(':userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.wishlistService.findAllByUser(userId);
  }
}
