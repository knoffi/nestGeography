import { Controller, Get } from '@nestjs/common';
import { CountryHolder, GeographyService } from './geography.service';

@Controller('geography')
export class GeographyController {
    constructor(private readonly service: GeographyService) {}
    @Get()
    getCurrency(): Promise<CountryHolder> {
        return this.service.getCurrency();
    }
}
