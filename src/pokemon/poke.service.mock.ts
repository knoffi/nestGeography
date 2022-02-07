import { IPokeService, NameHolder } from './poke.service';

export class PokeServiceMock implements IPokeService {
    getPokeAttack() {
        const mockReturn: NameHolder = {
            name: 'struggle',
            url: 'https://pokeapi.co/api/v2/move/struggle/',
        };
        return mockReturn;
    }
}
