import { GeographyController } from './geography.controller';
import { GeographyServiceMock } from './geography.service.mock';

describe('Geography controller validation', () => {
    const service = new GeographyServiceMock();
    const controller = new GeographyController(service);
    it('valid id', () => {
        const isValid = controller.isCountryID('FR');
        expect(isValid).toBe(true);
    });
    it('false id', () => {
        const isValid = controller.isCountryID('RICK+MORTY');
        expect(isValid).toBe(false);
    });
    it('empty id', () => {
        const isValid = controller.isCountryID('');
        expect(isValid).toBe(false);
    });
});
