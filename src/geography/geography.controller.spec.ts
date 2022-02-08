import { GeographyController } from './geography.controller';
import { GeographyServiceMock } from './geography.service.mock';

describe('Geography controller', () => {
    const service = new GeographyServiceMock();
    const controller = new GeographyController(service);

    describe('response', () => {
        it('for Germany', async () => {
            const response = await controller.getCountry({ id: 'DE' });
            expect(response).toHaveProperty(
                'country',
                GeographyServiceMock.mockCountry.country
            );
        });
    });
});
