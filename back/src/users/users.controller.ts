import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('search')
    search(@Query('q') q: string) {
        return this.usersService.search(q);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'))
    toggleStatus(@Param('id') id: string) {
        return this.usersService.toggleStatus(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id/history')
    getHistory(@Param('id') id: string) {
        return this.usersService.getHistory(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(id, updateUserDto);
    }
}
