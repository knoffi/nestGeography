import { Injectable } from '@nestjs/common';
import { ConfirmAuthDto, PostAuthDto } from './Auth';

@Injectable()
export class AuthService {
    static readonly MAX_NUMBER_OF_TOKEN_DIGITS = 4;

    confirm(login: ConfirmAuthDto): PostAuthDto {
        const token = this.generateToken();
        return { token };
    }

    private generateToken(): string {
        const tokenValue = Math.round(
            Math.random() * Math.pow(10, AuthService.MAX_NUMBER_OF_TOKEN_DIGITS)
        ).toString();
        return tokenValue;
    }
}
