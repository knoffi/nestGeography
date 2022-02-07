import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
} from '@nestjs/common';
import { countries } from 'countries-list';
import { CountryHolder, IGeographyService } from './geography.service';

@Controller('geography')
export class GeographyController {
    constructor(
        @Inject('IGeographyService') private readonly service: IGeographyService
    ) {}
    @Get(':id')
    async getCountry(@Param('id') id: string): Promise<CountryHolder> {
        const idIsValid = this.isCountryID(id);
        if (idIsValid) {
            return this.service.getCountry(id);
        } else {
            const countryIDs = Object.keys(countries);
            throw new HttpException(
                'id must be one of ' + JSON.stringify(countryIDs),
                HttpStatus.BAD_REQUEST
            );
        }
    }
    isCountryID(id: string): boolean {
        const countryIDs = Object.keys(countries);
        return countryIDs.some((countryID) => countryID === id);
    }
}
