import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string }) {
    return this.prisma.series.create({ data });
  }

  findAll() {
    return this.prisma.series.findMany();
  }

  findOne(id: string) {
    return this.prisma.series.findUnique({ where: { id } });
  }

  update(id: string, data: { name: string }) {
    return this.prisma.series.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.series.delete({ where: { id } });
  }
}
