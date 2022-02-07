import { Controller, Get, Param } from '@nestjs/common';
import { CountryHolder, GeographyService } from './geography.service';

@Controller('geography')
export class GeographyController {
    constructor(private readonly service: GeographyService) {}
    @Get(':id')
    getCurrency(@Param('id') id: string): Promise<CountryHolder> {
        return this.service.getCurrency(id);
    }
}
