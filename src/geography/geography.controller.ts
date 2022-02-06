import { Controller, Get } from '@nestjs/common';

@Controller('geography')
export class GeographyController {
    @Get()
    getCurrency() {
        return 'Hello World';
    }
}
