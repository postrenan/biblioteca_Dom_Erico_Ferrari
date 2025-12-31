import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput) {
        console.log('Creating user payload:', JSON.stringify(data));
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            // @ts-ignore
            return await this.prisma.user.create({
                data: {
                    ...data,
                    serieId: (data as any).serieId || undefined,
                // If email is empty string or whitespace, save as null to avoid unique constraint on ""
                // @ts-ignore: Stale Prisma types due to file lock
                email: (data.email && data.email.trim() !== '') ? data.email : null,
                password: hashedPassword,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                const target = error.meta?.target;
                if (target?.includes('email')) {
                    throw new ConflictException('Email já está em uso.');
                }
                if (target?.includes('matricula')) {
                    throw new ConflictException('Matrícula já está em uso.');
                }
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.user.findMany({
            include: { serie: true },
            orderBy: { name: 'asc' }
        });
    }

    async search(query: string) {
        return this.prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { matricula: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: { serie: true },
            take: 10
        });
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({ 
            where: { id },
            include: { serie: true }
        });
    }

    async findOneByEmail(email: string) {
        return this.prisma.user.findUnique({ 
            where: { email },
            include: { serie: true }
        });
    }

    async findOneByMatricula(matricula: string) {
        if (!matricula) return null;
        return this.prisma.user.findUnique({ 
            where: { matricula },
            include: { serie: true }
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        if (data.password && typeof data.password === 'string') {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({ 
            where: { id }, 
            data,
            include: { serie: true }
        });
    }

    async toggleStatus(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new BadRequestException('Usuário não encontrado.');

        return this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive }
        });
    }

    async getHistory(userId: string) {
        return this.prisma.loan.findMany({
            where: { userId },
            include: {
                bookCopy: {
                    include: {
                        book: true
                    }
                }
            },
            orderBy: {
                loanDate: 'desc'
            }
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }
}
