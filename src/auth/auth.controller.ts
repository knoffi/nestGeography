import {
    Body,
    Controller,
    Header,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ConfirmAuthDto, PostAuthDto } from './Auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('/login/')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/json')
    async confirm(@Body() login: ConfirmAuthDto): Promise<PostAuthDto> {
        const confirmation = await this.service.confirm(login);
        if (confirmation instanceof HttpException) {
            throw confirmation;
        } else {
            return confirmation;
        }
    }
}
