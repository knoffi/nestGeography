import {
    Body,
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
import { CreateUserDto, GetUserDto, User } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('IUsersService') public readonly service: IUsersService
    ) {}

    // TODO: use enum from external library instead of hard-writting this common header params
    @Get('/')
    @UseInterceptors(ClassSerializerInterceptor)
    @Header('Content-Type', 'application/json')
    async allUsers(): Promise<GetUserDto[]> {
        return await this.service.allUsers();
    }

    @Get(':id')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    async getUser(@Param('id') id: string): Promise<GetUserDto> {
        const searchResult = await this.service.getUser(id);
        if (searchResult instanceof User) {
            return searchResult;
        } else {
            throw searchResult;
        }
    }

    @Post('/')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    createUser(@Body() body: CreateUserDto): GetUserDto {
        const creation = this.service.create(body);
        if (creation instanceof User) {
            return creation;
        } else {
            throw creation;
        }
    }
    //REMOVE after tests are fixed
    @Get('post/post')
    postUser(): string {
        this.service.postRandomUser();
        return 'A';
    }
}
