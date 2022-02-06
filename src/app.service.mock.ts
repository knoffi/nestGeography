import { IAppService, NameHolder } from './app.service';

export class AppServiceMock implements IAppService {
    getPokeAttack() {
        const mockReturn: NameHolder = {
            name: 'struggle',
            url: 'https://pokeapi.co/api/v2/move/struggle/',
        };
        return mockReturn;
    }
}