import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfirmAuthDto, PostAuthDto } from './Auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    confirm(@Body() login: ConfirmAuthDto): PostAuthDto {
        return this.service.confirm(login);
    }
}
