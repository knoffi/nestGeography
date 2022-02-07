import { CountryHolder, IGeographyService } from './geography.service';

export class GeographyServiceMock implements IGeographyService {
    public static readonly mockCountry: CountryHolder = {
        country: { name: 'Germany', currency: 'EUR', capital: 'Berlin' },
    };
    getCountry() {
        return GeographyServiceMock.mockCountry;
    }
}
