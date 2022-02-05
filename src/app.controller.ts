import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get(':id')
    getPokeName(@Param() params): any {
        return this.appService.getPokeAttack(params.id);
    }
}
