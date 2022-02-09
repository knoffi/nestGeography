import { Test } from '@nestjs/testing';
import { PokeController } from './poke.controller';
import { IPokeService } from './poke.service';
import { PokeServiceMock } from './poke.service.mock';

// needs in package.json:   "jest:": {"restoreMocks":true}, otherwise reset spys with beforeEach(...)
describe('PokeController', () => {
    let controller: PokeController;
    let service: IPokeService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PokeController],
            providers: [{ useClass: PokeServiceMock, provide: 'IPokeService' }],
        }).compile();

        service = moduleRef.get<IPokeService>('IPokeService');
        controller = moduleRef.get<PokeController>(PokeController);
    });
    it('response from valid id', async () => {
        const body = await controller.getPokeName({ id: 150 });
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('url');
    });
});
