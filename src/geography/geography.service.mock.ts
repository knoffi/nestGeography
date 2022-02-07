import { CountryHolder, IGeographyService } from './geography.service';

export class GeographyServiceMock implements IGeographyService {
    private static readonly defaultCountry: CountryHolder = {
        country: { name: 'Germany', currency: 'EUR', capital: 'Berlin' },
    };
    getCountry() {
        return GeographyServiceMock.defaultCountry;
    }
}
