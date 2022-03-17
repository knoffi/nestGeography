import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [{ provide: 'IUsersService', useClass: UsersService }],
    imports: [TypeOrmModule.forFeature([User]), HttpModule],
})
export class UsersModule {}
