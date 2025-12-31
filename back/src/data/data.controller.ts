import { Controller, Get, Post, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('export/users')
  async exportUsers(@Res() res: Response) {
    const csv = await this.dataService.generateUsersCsv();
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users.csv"',
    });
    res.send(csv);
  }

  @Get('export/books')
  async exportBooks(@Res() res: Response) {
    const csv = await this.dataService.generateBooksCsv();
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="books.csv"',
    });
    res.send(csv);
  }

  @Post('import/users')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('File is required');
    return this.dataService.importUsers(file.buffer);
  }

  @Post('import/books')
  @UseInterceptors(FileInterceptor('file'))
  async importBooks(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('File is required');
    return this.dataService.importBooks(file.buffer);
  }
}
