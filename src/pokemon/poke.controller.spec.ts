import { Test } from '@nestjs/testing';
import { PokeController } from './poke.controller';
import { PokeServiceMock } from './poke.service.mock';

// needs in package.json:   "jest:": {"restoreMocks":true}, otherwise reset spys with beforeEach(...)
describe('PokeController', () => {
    let controller: PokeController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PokeController],
            providers: [{ useClass: PokeServiceMock, provide: 'IPokeService' }],
        }).compile();

        controller = moduleRef.get<PokeController>(PokeController);
    });
    it('response from valid id', async () => {
        const body = await controller.getPokeName({ id: 150 });
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('url');
        const properties = Object.keys(body);
        expect(properties).toHaveLength(2);
    });
});
