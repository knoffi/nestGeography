import { Controller, Get } from '@nestjs/common';
import { AppService, HelloWorld } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): HelloWorld {
        return this.appService.getHello();
    }
}
