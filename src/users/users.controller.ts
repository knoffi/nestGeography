import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { IUsersService } from './IUsersService';
import {
    CreateUserDto,
    CreateUserPartialDto,
    GetUserDto,
    User,
} from './users.entity';

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
    async createUser(@Body() body: CreateUserDto): Promise<GetUserDto> {
        const creation = await this.service.create(body);
        if (creation instanceof User) {
            return creation;
        } else {
            throw creation;
        }
    }
    @Delete(':id')
    @Header('Content-Type', 'application/json')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        const deletion = await this.service.delete(id);
        if (deletion instanceof HttpException) {
            throw deletion;
        }
    }
    @Patch(':id')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id') id: string,
        @Body() updates: CreateUserPartialDto
    ): Promise<GetUserDto | HttpException> {
        const update = await this.service.update(id, updates);
        if (update instanceof User) {
            return update;
        } else {
            throw update;
        }
    }
    //REMOVE after tests are fixed
    @Get('post/post')
    postUser(): string {
        this.service.postRandomUser();
        return 'A';
    }
    @Get('delete/:id')
    deleteUser(@Param('id') id: string): string {
        this.service.deleteRandomUser(id);
        return 'B';
    }
    @Get('patch/:id')
    updateUser(@Param('id') id: string): string {
        this.service.updateRandomUser(id);
        return 'B';
    }
}
