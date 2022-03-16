import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Header,
    Inject,
    Param,
    Post,
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
        const searchResult = this.service.getUser(id);
        if (searchResult instanceof User) {
            return searchResult;
        } else {
            throw searchResult;
        }
    }
    @Post('/')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    createUser(): User {
        const creation = this.service.getUser('69');
        if (creation instanceof User) {
            return creation;
        } else {
            throw creation;
        }
    }
}
