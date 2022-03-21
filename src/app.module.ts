import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { GeographyModule } from './geography/geography.module';
import { PokeModule } from './pokemon/poke.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        PokeModule,
        GeographyModule,
        UsersModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        AuthModule,
        //FRAGE
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            include: [UsersModule],
            // FRAGE : maybe from node:path instead?
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
    ],
})
export class AppModule {}
