import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { BooksService } from '../books/books.service';

@Module({
  controllers: [DataController],
  providers: [DataService, PrismaService, UsersService, BooksService],
})
export class DataModule {}
