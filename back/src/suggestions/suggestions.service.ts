import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { title: string; author?: string; reason?: string }) {
    return this.prisma.suggestion.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.suggestion.findMany({
      include: {
        user: {
          select: {
            name: true,
            matricula: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.suggestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.suggestion.update({
      where: { id },
      data: { status },
    });
  }
}
