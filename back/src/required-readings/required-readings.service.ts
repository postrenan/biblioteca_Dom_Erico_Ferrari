import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequiredReadingsService {
  constructor(private prisma: PrismaService) {}

  async create(serieId: string, bookId: string) {
    return this.prisma.requiredReading.create({
      data: { serieId, bookId },
      include: {
        book: true,
        serie: true,
      },
    });
  }

  async findAll() {
    return this.prisma.requiredReading.findMany({
      include: {
        book: true,
        serie: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { serieId: true },
    });

    if (!user?.serieId) return [];

    return this.findBySerie(user.serieId);
  }

  async findBySerie(serieId: string) {
    return this.prisma.requiredReading.findMany({
      where: { serieId },
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

  async delete(id: string) {
    return this.prisma.requiredReading.delete({
      where: { id },
    });
  }
}
