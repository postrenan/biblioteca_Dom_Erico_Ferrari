import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  // --- EXPORT ---

  async generateUsersCsv(): Promise<string> {
    const users = await this.prisma.user.findMany();
    const headers = ['Name', 'Email', 'Role', 'Matricula', 'IsActive', 'SerieId'];
    const rows = users.map(u => {
        return [
            this.escapeCsv(u.name),
            this.escapeCsv(u.email || ''),
            u.role,
            this.escapeCsv(u.matricula),
            u.isActive ? '1' : '0',
            u.serieId || ''
        ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  async generateBooksCsv(): Promise<string> {
    const books = await this.prisma.book.findMany();
    const headers = ['Title', 'Author', 'Description', 'Genre', 'PublicationDate', 'TotalCopies'];
    const rows = books.map(b => {
        return [
            this.escapeCsv(b.title),
            this.escapeCsv(b.author),
            this.escapeCsv(b.description),
            this.escapeCsv(b.genre || ''),
            b.publicationDate || '',
            b.totalCopies.toString()
        ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  // --- IMPORT ---

  async importUsers(buffer: Buffer) {
    const text = buffer.toString('utf-8');
    const lines = text.split('\n');
    let imported = 0;
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parse: assume comma separation, no internal commas for now unless quoted.
        // For robustness, really should use a library, but sticking to simple split for zero-dep.
        const cols = this.parseCsvLine(line);
        if (cols.length < 5) continue; 
        
        const [name, email, role, matricula, isActiveStr, serieId] = cols;
        
        // Basic deduplication check
        const exists = await this.prisma.user.findFirst({
            where: { 
                OR: [
                    { matricula: matricula },
                    { email: (email && email.trim() !== '') ? email : undefined }
                ]
            }
        });

        if (!exists) {
            const hashedPassword = await bcrypt.hash('123456', 10); // Default password
            await this.prisma.user.create({
                data: {
                    name,
                    email: (email && email.trim() !== '') ? email : null,
                    role,
                    matricula,
                    isActive: isActiveStr === '1',
                    serieId: serieId || null,
                    password: hashedPassword
                }
            });
            imported++;
        }
    }
    return { message: `Imported ${imported} users` };
  }

  async importBooks(buffer: Buffer) {
    const text = buffer.toString('utf-8');
    const lines = text.split('\n');
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = this.parseCsvLine(line);
        if (cols.length < 6) continue;

        const [title, author, description, genre, pubDate, totalCopiesStr] = cols;

        await this.prisma.book.create({
            data: {
                title,
                author,
                description,
                genre,
                publicationDate: pubDate,
                totalCopies: parseInt(totalCopiesStr) || 0,
                availableCopies: parseInt(totalCopiesStr) || 0
            }
        });
        imported++;
    }
    return { message: `Imported ${imported} books` };
  }

  // --- HELPERS ---

  private escapeCsv(field: string): string {
    if (!field) return '';
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  private parseCsvLine(line: string): string[] {
      // Basic regex for CSV parsing handles quotes
      const pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
      // Actually simple split is risky if data has commas. 
      // Let's use a simpler approach: strict split if we assume safe inputs, 
      // OR a regex that handles quotes.
      
      // Matches: "quoted field" OR non-comma-sequence
      // preceded by start or comma
      const matches: string[] = [];
      let current = '';
      let inQuote = false;
      
      for(let i=0; i<line.length; i++) {
          const char = line[i];
          if(char === '"') {
              inQuote = !inQuote;
          } else if(char === ',' && !inQuote) {
              matches.push(this.cleanField(current));
              current = '';
          } else {
              current += char;
          }
      }
      matches.push(this.cleanField(current));
      return matches;
  }
  
  private cleanField(field: string): string {
      field = field.trim();
      if(field.startsWith('"') && field.endsWith('"')) {
          return field.substring(1, field.length - 1).replace(/""/g, '"');
      }
      return field;
  }
}
