import {
    Body,
    Controller,
    Header,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfirmAuthDto, PostAuthDto } from './Auth';
import { AuthServiceErrors } from './auth.serrice.errors';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('/login/')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/json')
    async confirm(@Body() login: ConfirmAuthDto): Promise<PostAuthDto> {
        const confirmation = await this.service.confirm(login);
        if (confirmation === AuthServiceErrors.authFail) {
            throw new UnauthorizedException(confirmation);
        } else {
            return confirmation;
        }
    }
}
