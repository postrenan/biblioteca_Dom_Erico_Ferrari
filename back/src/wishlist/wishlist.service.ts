import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, bookId: string) {
    return this.prisma.wishlistItem.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: {},
      create: {
        userId,
        bookId,
      },
    });
  }

  async remove(userId: string, bookId: string) {
    return this.prisma.wishlistItem.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            categories: true,
            copies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
