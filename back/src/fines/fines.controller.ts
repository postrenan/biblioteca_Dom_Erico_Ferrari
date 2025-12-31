import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { FinesService } from './fines.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fines')
export class FinesController {
    constructor(private readonly finesService: FinesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createFineDto) {
        return this.finesService.create(createFineDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.finesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my')
    findMy(@Request() req) {
        return this.finesService.findByUser(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/pay')
    pay(@Param('id') id: string) {
        return this.finesService.pay(id);
    }
}
