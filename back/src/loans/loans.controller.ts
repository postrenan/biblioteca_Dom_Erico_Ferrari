import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { LoansService } from './loans.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('loans')
export class LoansController {
    constructor(private readonly loansService: LoansService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createLoanDto) {
        // Expects copyCode instead of bookId
        return this.loansService.create(createLoanDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.loansService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my')
    findMy(@Request() req) {
        return this.loansService.findMyLoans(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/return')
    returnBook(@Param('id') id: string) {
        return this.loansService.returnBook(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/renew')
    renewLoan(@Param('id') id: string, @Request() req) {
        return this.loansService.renewLoan(id, req.user.id, req.user.role);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('overdue')
    findOverdue() {
        return this.loansService.findOverdue();
    }
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/progress')
    updateProgress(@Param('id') id: string, @Body() body) {
        return this.loansService.updateProgress(id, body);
    }
}
