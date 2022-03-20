import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeographyModule } from './geography/geography.module';
import { PokeModule } from './pokemon/poke.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        PokeModule,
        GeographyModule,
        UsersModule,
        //FRAGE
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        AuthModule,
    ],
})
export class AppModule {}
