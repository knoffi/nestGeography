import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './../users/IUsersService';
import { ConfirmAuthDto, PostAuthDto } from './Auth';

@Injectable()
export class AuthService {
    static readonly MAX_NUMBER_OF_TOKEN_DIGITS = 4;

    constructor(@Inject('IUsersService') private usersService: IUsersService) {}

    async confirm(login: ConfirmAuthDto): Promise<PostAuthDto | HttpException> {
        const loginConfirmed = await this.usersService.confirm(login);
        if (loginConfirmed) {
            const token = this.generateToken();
            return { token };
        } else {
            return new HttpException(
                'Email not found or password mismatch',
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    postAuthDto(token: string): PostAuthDto {
        const dto: PostAuthDto = { token };
        return dto;
    }

    private generateToken(): string {
        const tokenValue = Math.round(
            Math.random() * Math.pow(10, AuthService.MAX_NUMBER_OF_TOKEN_DIGITS)
        ).toString();
        return tokenValue;
    }
}
