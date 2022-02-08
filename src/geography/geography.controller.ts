import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CountryHolder, IGeographyService } from './geography.service';
import { IsCountryId } from './IsCountryId';
export class CountryId {
    @IsCountryId('id', { message: 'id must be a country id' })
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}
@Controller('geography')
export class GeographyController {
    constructor(
        @Inject('IGeographyService') private readonly service: IGeographyService
    ) {}
    @Get(':id')
    async getCountry(@Param() params: CountryId): Promise<CountryHolder> {
        return this.service.getCountry(params.id);
    }
}
