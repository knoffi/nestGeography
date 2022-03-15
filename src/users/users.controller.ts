import { Controller, Get, Inject } from '@nestjs/common';
import { users } from './User';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('IUsersService') private readonly service: UsersService
    ) {}
    @Get('/')
    allUsers() {
        return users;
    }
}
