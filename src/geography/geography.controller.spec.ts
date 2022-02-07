import { GeographyController } from './geography.controller';
import { GeographyServiceMock } from './geography.service.mock';

describe('Geography controller', () => {
    const service = new GeographyServiceMock();
    const controller = new GeographyController(service);
    describe('validation', () => {
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
    describe('response', () => {
        it('for Germany', async () => {
            const spy = jest.spyOn(
                GeographyController.prototype,
                'isCountryID'
            );
            const response = await controller.getCountry('DE');
            expect(response).toHaveProperty(
                'country',
                GeographyServiceMock.mockCountry.country
            );
            expect(spy).toBeCalled();
        });
        it('for wrong id', () => {
            const spy = jest.spyOn(
                GeographyController.prototype,
                'isCountryID'
            );
            const throwException = () => controller.getCountry('RICK+MORTY');
            expect(throwException()).rejects.toThrow('id');
            expect(spy).toBeCalled();
        });
    });
});
