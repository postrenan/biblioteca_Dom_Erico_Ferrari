import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const { categoryIds, ...bookData } = data;
        return this.prisma.book.create({
            data: {
                ...bookData,
                categories: categoryIds ? {
                    connect: categoryIds.map(id => ({ id }))
                } : undefined
            }
        });
    }

    async findAll() {
        const books = await this.prisma.book.findMany({
            include: { 
                copies: {
                    include: {
                        loans: {
                            where: { status: { in: ['ACTIVE', 'OVERDUE'] } },
                            include: { user: true }
                        }
                    }
                },
                categories: true
            }
        });

        // Transform to simple format for frontend
        return books.map(book => {
            const activeCopies = book.copies.filter(c => c.status !== 'REMOVED');
            const available = activeCopies.filter(c => c.status === 'AVAILABLE').length;
            const total = activeCopies.length;

            return {
                ...book,
                totalCopies: total,
                availableCopies: available,
                categoryName: book.categories.map(c => c.name).join(', ') || 'Sem Categoria'
            };
        });
    }

    async search(query: string) {
        const books = await this.prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { author: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: { 
                copies: {
                    include: {
                        loans: {
                            where: { status: { in: ['ACTIVE', 'OVERDUE'] } },
                            include: { user: true }
                        }
                    }
                },
                categories: true
            },
            take: 10
        });

        return books.map(book => {
            const activeCopies = book.copies.filter(c => c.status !== 'REMOVED');
            const available = activeCopies.filter(c => c.status === 'AVAILABLE').length;
            const total = activeCopies.length;
            
            return {
                ...book,
                totalCopies: total,
                availableCopies: available,
                categoryName: book.categories.map(c => c.name).join(', ') || 'Sem Categoria'
            };
        });
    }

    findOne(id: string) {
        return this.prisma.book.findUnique({
            where: { id },
            include: { 
                copies: {
                    include: {
                        loans: {
                            where: { status: { in: ['ACTIVE', 'OVERDUE'] } },
                            include: { user: true }
                        }
                    }
                },
                categories: true
            }
        });
    }

    async update(id: string, data: any) {
        const { categoryIds, ...bookData } = data;
        return this.prisma.book.update({
            where: { id },
            data: {
                ...bookData,
                categories: categoryIds ? {
                    set: categoryIds.map(id => ({ id }))
                } : undefined
            },
            include: { categories: true }
        });
    }

    async remove(id: string) {
        // Check for non-removed copies
        const activeCopiesCount = await this.prisma.bookCopy.count({
            where: {
                bookId: id,
                status: { not: 'REMOVED' }
            }
        });

        if (activeCopiesCount > 0) {
            throw new Error('Não é possível excluir um livro que possui cópias ativas (Disponíveis ou Emprestadas). Remova as cópias primeiro.');
        }

        // If we are here, all copies are REMOVED (or there are no copies).
        // We delete the copies first (cascade simulation) then the book.
        // Prisma transaction ensures atomicity.
        return this.prisma.$transaction(async (tx) => {
            // Delete related loans first if they exist? 
            // Assuming copies have loans. We need to delete loans or cascade.
            // Let's delete copies. If schema restrict loans, this will fail.
            // Ideally schema should have onDelete: Cascade for Loans->Copy and Copy->Book.
            // Since we don't change schema now, we try deleting copies.
            await tx.loan.deleteMany({
                where: { bookCopy: { bookId: id } }
            });

            await tx.bookCopy.deleteMany({
                where: { bookId: id }
            });

            return tx.book.delete({
                where: { id }
            });
        });
    }

    async addCopy(bookId: string, copyCode: string, customLabel?: string) {
        // Fetch global label setting first
        const setting = await this.prisma.systemSetting.findUnique({
             where: { key: 'labelType' }
        });
        const labelType = setting?.value || 'AUTO';

        const book = await this.prisma.book.findUnique({
            where: { id: bookId },
            include: { categories: true, copies: true }
        });

        if (!book) throw new Error('Book not found');

        let finalCustomLabel = customLabel;
        let finalCopyCode = copyCode;

        if (labelType === 'AUTO') {
            const firstCat = book.categories[0]?.name || 'X';
            const catLetter = firstCat.charAt(0).toUpperCase();
            const titleLetters = book.title.substring(0, 3).toUpperCase();
            const copyNumber = book.totalCopies + 1;
            const generatedLabel = `${catLetter}${titleLetters}-${copyNumber}`;
            
            finalCustomLabel = generatedLabel;
            // For AUTO, we also auto-generate the copyCode if it's empty, 
            // using the same pattern to ensure uniqueness logic is handled by the pattern 
            // (assuming the pattern intends to be unique per copy)
            if (!finalCopyCode) {
                finalCopyCode = generatedLabel; 
            }
        }

        if (!finalCopyCode) {
            throw new Error('Code is required for Manual mode');
        }

        const copy = await this.prisma.bookCopy.create({
            data: {
                bookId,
                copyCode: finalCopyCode,
                customLabel: finalCustomLabel,
                status: 'AVAILABLE'
            }
        });

        // Update book counts
        await this.prisma.book.update({
            where: { id: bookId },
            data: {
                totalCopies: { increment: 1 },
                availableCopies: { increment: 1 }
            }
        });

        return copy;
    }

    async removeCopy(copyId: string, reason: string) {
        const copy = await this.prisma.bookCopy.findUnique({
            where: { id: copyId }
        });

        if (!copy) throw new Error('Copy not found');
        // if (copy.status !== 'AVAILABLE') throw new Error('Cannot delete a loaned copy'); 
        // Allow removing even if loaned? Probably should check if LOANED to prevent inconsistency, or handle loan closure.
        // For now, let's keep restriction: only AVAILABLE or maybe LOST can be removed for inventory reasons.
        // If it's LOANED, user should return it or mark as LOST first. 
        if (copy.status === 'LOANED') {
             throw new Error('Cannot remove a loaned copy. Return it or mark as lost first.');
        }

        // Soft Delete
        await this.prisma.bookCopy.update({
             where: { id: copyId },
             data: {
                 status: 'REMOVED',
                 removalReason: reason
             } as any
        });

        // Update book counts
        // Decrement totalCopies always
        // Decrement availableCopies only if it was AVAILABLE
        const isAvailable = copy.status === 'AVAILABLE';

        await this.prisma.book.update({
            where: { id: copy.bookId },
            data: {
                totalCopies: { decrement: 1 },
                availableCopies: isAvailable ? { decrement: 1 } : undefined
            }
        });

        return { success: true };
    }
    async getRequiredReadings(bookId: string) {
        return this.prisma.requiredReading.findMany({
            where: { bookId },
            include: { serie: true }
        });
    }
}
