import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './poke.controller';
import { AppService } from './poke.service';

@Module({
    imports: [HttpModule],
    controllers: [AppController],
    providers: [{ provide: 'IAppService', useClass: AppService }],
})
export class PokeModule {}
