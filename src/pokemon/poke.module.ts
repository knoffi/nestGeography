import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PokeController } from './poke.controller';
import { PokeService } from './poke.service';

@Module({
    imports: [HttpModule],
    controllers: [PokeController],
    providers: [{ provide: 'IPokeService', useClass: PokeService }],
})
export class PokeModule {}
