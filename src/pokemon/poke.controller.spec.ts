import { PokeController } from './poke.controller';
import { PokeServiceMock } from './poke.service.mock';

// needs in package.json:   "jest:": {"restoreMocks":true}, otherwise reset spys with beforeEach(...)
describe('PokeController', () => {
    const service = new PokeServiceMock();
    const controller = new PokeController(service);
    describe('response', () => {
        it('valid id', async () => {
            const body = await controller.getPokeName({ id: 150 });
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('url');
        });
    });
});
