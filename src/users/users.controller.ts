import { Controller, Get, Header, Inject, Param } from '@nestjs/common';
import { User } from './User';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('IUsersService') private readonly service: UsersService
    ) {}
    // TODO: use enum from external library instead of hard-writting this common header params
    @Get('/')
    @Header('Content-Type', 'application/json')
    allUsers(): User[] {
        return this.service.allUsers();
    }
    @Get(':id')
    getUser(@Param('id') id: string): User {
        return this.service.getUser(id);
    }
}
