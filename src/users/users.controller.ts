import { Controller, Get, Header, Inject } from '@nestjs/common';
import { users } from './User';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('IUsersService') private readonly service: UsersService
    ) {}
    // TODO: use enum from external library instead of hard-writting this common header params
    @Get('/')
    @Header('Content-Type', 'application/json')
    allUsers() {
        return users;
    }
}
