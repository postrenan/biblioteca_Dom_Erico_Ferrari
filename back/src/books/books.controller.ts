import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    create(@Body() createBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Get('search')
    search(@Query('q') q: string) {
        return this.booksService.search(q);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.booksService.remove(id);
    }

    @Post(':id/copies')
    addCopy(@Param('id') id: string, @Body() data: { copyCode: string; customLabel?: string }) {
        return this.booksService.addCopy(id, data.copyCode, data.customLabel);
    }

    @Delete('copies/:copyId')
    removeCopy(@Param('copyId') copyId: string, @Body() body: { reason: string }) {
        return this.booksService.removeCopy(copyId, body.reason);
    }
    @Get(':id/required-readings')
    getRequiredReadings(@Param('id') id: string) {
        return this.booksService.getRequiredReadings(id);
    }
}
