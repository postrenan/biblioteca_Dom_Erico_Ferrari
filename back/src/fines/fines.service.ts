import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinesService {
    constructor(private prisma: PrismaService) { }

    async create(data: { userMatricula: string; loanId?: string; value: number; reason: string }) {
        const user = await this.prisma.user.findUnique({ where: { matricula: data.userMatricula } });
        if (!user) throw new Error('Usuário não encontrado');

        return this.prisma.fine.create({
            data: {
                userId: user.id,
                loanId: data.loanId,
                value: data.value,
                reason: data.reason,
                status: 'PENDING'
            },
            include: { user: true }
        });
    }

    async findAll() {
        return this.prisma.fine.findMany({ include: { user: true, loan: { include: { bookCopy: { include: { book: true } } } } } });
    }

    async findByUser(userId: string) {
        return this.prisma.fine.findMany({
            where: { userId },
            include: { loan: { include: { bookCopy: { include: { book: true } } } } }
        });
    }

    async pay(id: string) {
        return this.prisma.fine.update({
            where: { id },
            data: { status: 'PAID', paidAt: new Date() },
            include: { loan: { include: { bookCopy: { include: { book: true } } } } }
        });
    }
}
