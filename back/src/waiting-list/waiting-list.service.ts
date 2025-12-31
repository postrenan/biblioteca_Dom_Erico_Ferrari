import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WaitingListService {
  constructor(private prisma: PrismaService) {}

  async joinQueue(userId: string, bookId: string) {
    // Check if user is already in queue
    const existing = await this.prisma.waitingList.findFirst({
      where: { userId, bookId },
    });

    if (existing) {
        throw new BadRequestException('Você já está na fila para este livro.');
    }

    // Check if book has available copies (if so, why queue?)
    // Optional logic: Only allow queue if availableCopies == 0
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (book && book.availableCopies > 0) {
         // Allow anyway? Or block? Let's allow but maybe warn frontend.
    }

    return this.prisma.waitingList.create({
      data: { userId, bookId },
    });
  }

  async getQueueByBook(bookId: string) {
    // 1. Fetch queue with user info including serie
    const queue = await this.prisma.waitingList.findMany({
      where: { bookId },
      include: {
        user: { 
            include: { serie: true },
        },
        book: { select: { title: true } }
      },
      orderBy: { createdAt: 'asc' }, // Default FIFO
    });

    // 2. Fetch required readings for this book to know which series have priority
    const requiredReadings = await this.prisma.requiredReading.findMany({
        where: { bookId },
        select: { serieId: true }
    });
    const prioritySerieIds = new Set(requiredReadings.map(r => r.serieId));

    // 3. Sort: Priority first, then others. Both groups sorted by createdAt (which is already done by DB, so we stable sort)
    // Note: JS sort is stable since recent versions.
    return queue.sort((a, b) => {
        const aPriority = a.user.serieId && prioritySerieIds.has(a.user.serieId);
        const bPriority = b.user.serieId && prioritySerieIds.has(b.user.serieId);

        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return 0; // Keep original order (createdAt)
    });
  }

  async getUserQueue(userId: string) {
    const myItems = await this.prisma.waitingList.findMany({
      where: { userId },
      include: {
        book: { select: { id: true, title: true, author: true, coverUrl: true, availableCopies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate position for each item
    // Since priority logic is complex, we re-reuse getQueueByBook to find index
    const resultsWithPosition = await Promise.all(myItems.map(async (item) => {
        const fullQueue = await this.getQueueByBook(item.bookId);
        const position = fullQueue.findIndex(x => x.userId === userId) + 1;
        return { ...item, position };
    }));

    return resultsWithPosition;
  }

  async leaveQueue(id: string) {
    return this.prisma.waitingList.delete({
      where: { id },
    });
  }
  
  async checkUserStatus(userId: string, bookId: string) {
       const item = await this.prisma.waitingList.findFirst({
           where: { userId, bookId }
       });
       return { inQueue: !!item };
  }
}
