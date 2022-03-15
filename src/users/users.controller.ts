import { Controller, Get } from '@nestjs/common';
import { users } from './User';

@Controller('users')
export class UsersController {
    @Get('/')
    allUsers() {
        return users;
    }
}
