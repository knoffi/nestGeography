import { GeographyController } from './geography.controller';
import { GeographyServiceMock } from './geography.service.mock';
import { validate } from './IsCountryId';

describe('Geography controller', () => {
    const service = new GeographyServiceMock();
    const controller = new GeographyController(service);

    it('for Germany', async () => {
        const response = await controller.getCountry({ id: 'DE' });
        expect(response).toHaveProperty(
            'country',
            GeographyServiceMock.mockCountry.country
        );
    });
});
describe('Country ID validator', () => {
    it('false id', () => {
        expect(validate('ABCEFGH')).toBe(false);
    });
    it('empty id', () => {
        expect(validate('')).toBe(false);
    });
    it("France's id", () => {
        expect(validate('FR')).toBe(true);
    });
});
