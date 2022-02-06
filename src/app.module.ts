import { Module } from '@nestjs/common';
import { GeographyModule } from './geography/geography.module';
import { PokeModule } from './pokemon/poke.module';

@Module({
    imports: [PokeModule, GeographyModule],
})
export class AppModule {}
