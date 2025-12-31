import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body) {
        console.log('Login request body:', body);
        // body.matricula instead of email
        if (!body.matricula) {
             return { error: 'Matricula is missing' };
        }
        const user = await this.authService.validateUser(body.matricula, body.password);
        if (!user) {
            return { error: 'Credenciais inválidas ou usuário suspenso.' };
        }
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
