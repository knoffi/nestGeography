import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ],
})
export class AppModule {}
