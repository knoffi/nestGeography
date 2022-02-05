import { Controller, Get } from '@nestjs/common';
import { AppService, Attack } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/pikachu')
    getHello(): Attack {
        return this.appService.getPokeAttack();
    }
}
