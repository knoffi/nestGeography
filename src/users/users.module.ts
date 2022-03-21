import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
    controllers: [UsersController],
    providers: [{ provide: 'IUsersService', useClass: UsersService }, UsersResolver],
    imports: [TypeOrmModule.forFeature([User]), HttpModule],
    exports: [{ provide: 'IUsersService', useClass: UsersService }],
})
export class UsersModule {}
