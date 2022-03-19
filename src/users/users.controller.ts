import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    ConflictException,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
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
} from './users.entity';
import { UsersServiceErrors } from './users.service.errors';

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
        const selection = await this.service.getUser(id);
        if (selection === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(selection);
        } else {
            return selection;
        }
    }

    @Post('/')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    async createUser(@Body() body: CreateUserDto): Promise<GetUserDto> {
        const creation = await this.service.create(body);
        if (creation === UsersServiceErrors.doubleEmail) {
            throw new ConflictException(creation);
        } else {
            return creation;
        }
    }
    @Delete(':id')
    @Header('Content-Type', 'application/json')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        const deletion = await this.service.delete(id);
        if (deletion === UsersServiceErrors.idNotFound) {
            throw new NotFoundException(deletion);
        }
    }
    @Patch(':id')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id') id: string,
        @Body() updates: CreateUserPartialDto
    ): Promise<GetUserDto> {
        const update = await this.service.update(id, updates);
        switch (update) {
            case UsersServiceErrors.doubleEmail:
                throw new ConflictException(update);
            case UsersServiceErrors.emptyUpdate:
                throw new BadRequestException(update);
            case UsersServiceErrors.idNotFound:
                throw new BadRequestException(update);
            default:
                return update;
        }
    }
}
