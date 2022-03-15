import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Header,
    Inject,
    Param,
    UseInterceptors,
} from '@nestjs/common';
import { IUsersService } from './IUsersService';
import { User } from './User';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('IUsersService') private readonly service: IUsersService
    ) {}
    // TODO: use enum from external library instead of hard-writting this common header params
    @Get('/')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    allUsers(): User[] {
        return this.service.allUsers();
    }
    @Get(':id')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    getUser(@Param('id') id: string): User {
        const result = this.service.getUser(id);
        if (result instanceof User) {
            return result;
        } else {
            throw result;
        }
    }
}
