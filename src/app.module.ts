import { Module } from '@nestjs/common';
import { GeographyModule } from './geography/geography.module';
import { PokeModule } from './pokemon/poke.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [PokeModule, GeographyModule, UsersModule],
})
export class AppModule {}
