import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoansService {
    constructor(private prisma: PrismaService) { }

    async create(data: { copyCode: string; userMatricula: string; returnDate: string }) {
        // Find copy by Code
        const copy = await this.prisma.bookCopy.findUnique({ where: { copyCode: data.copyCode } });

        if (!copy) throw new BadRequestException('Exemplar não encontrado.');
        if (copy.status !== 'AVAILABLE') throw new BadRequestException('Exemplar indisponível.');

        const dueDate = new Date(data.returnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate < today) {
            throw new BadRequestException('A data de devolução não pode ser anterior ao dia atual.');
        }

        // Find user by Matricula
        const user = await this.prisma.user.findUnique({ where: { matricula: data.userMatricula } });
        if (!user) throw new BadRequestException('Usuário não encontrado.');

        // Checkout transaction
        return this.prisma.$transaction(async (tx) => {
            await tx.bookCopy.update({
                where: { id: copy.id },
                data: { status: 'LOANED' },
            });

            return tx.loan.create({
                data: {
                    bookCopy: { connect: { id: copy.id } },
                    user: { connect: { id: user.id } },
                    dueDate: new Date(data.returnDate),
                    status: 'ACTIVE'
                },
                include: { bookCopy: { include: { book: true } }, user: true }
            });
        });
    }

    findAll() {
        return this.prisma.loan.findMany({
            include: { 
                bookCopy: { include: { book: true } }, 
                user: true,
                renewals: { include: { renewedBy: true } }
            }
        });
    }

    findMyLoans(userId: string) {
        return this.prisma.loan.findMany({
            where: { userId },
            include: { bookCopy: { include: { book: true } } }
        });
    }

    async returnBook(id: string) {
        const loan = await this.prisma.loan.findUnique({ where: { id } });
        if (!loan || loan.status === 'RETURNED') {
            throw new BadRequestException('Empréstimo inválido ou já devolvido.');
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.bookCopy.update({
                where: { id: loan.bookCopyId },
                data: { status: 'AVAILABLE' },
            });

            return tx.loan.update({
                where: { id },
                data: { status: 'RETURNED', returnDate: new Date() },
            });
        });
    }

    async renewLoan(id: string, renewedById: string, role: string) {
        const loan = await this.prisma.loan.findUnique({ where: { id } });
        if (!loan) throw new BadRequestException('Empréstimo não encontrado.');
        if (loan.status !== 'ACTIVE' && loan.status !== 'OVERDUE') {
            throw new BadRequestException('Não é possível renovar um livro devolvido.');
        }

        // Student limit: 1 renewal
        if (role === 'STUDENT' && loan.renewCount >= 1) {
            throw new BadRequestException('Você já atingiu o limite de 1 renovação para este livro.');
        }

        // Extend due date by 7 days
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 7);

        return this.prisma.$transaction(async (tx) => {
            // Create renewal log
            await tx.loanRenewal.create({
                data: {
                    loanId: id,
                    userId: renewedById
                }
            });

            return tx.loan.update({
                where: { id },
                data: {
                    dueDate: newDueDate,
                    renewCount: { increment: 1 },
                    status: 'ACTIVE'
                },
                include: { 
                    bookCopy: { include: { book: true } },
                    renewals: { include: { renewedBy: true } }
                }
            });
        });
    }

    findOverdue() {
        return this.prisma.loan.findMany({
            where: {
                OR: [
                    { status: 'OVERDUE' },
                    {
                        status: 'ACTIVE',
                        dueDate: { lt: new Date() }
                    }
                ]
            },
            include: { 
                bookCopy: { include: { book: true } }, 
                user: true,
                renewals: { include: { renewedBy: true } }
            }
        });
    }
    async updateProgress(id: string, data: { pagesRead?: number; rating?: number; review?: string }) {
        return this.prisma.loan.update({
            where: { id },
            data: {
                pagesRead: data.pagesRead,
                rating: data.rating,
                review: data.review
            },
            include: { 
                 bookCopy: { include: { book: true } } 
            }
        });
    }
}
